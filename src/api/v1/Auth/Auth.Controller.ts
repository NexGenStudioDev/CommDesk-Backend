import { Request, Response } from "express";
import { permissionService } from "../Permission/Permission.service";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Default_Organization_Permissions } from "../Permission/Permission.constant";
import { communityService } from "../Community/Community.Service";
import { authService } from "./Auth.Service";
import { authUtils } from "./Auth.Utils";
import { AuthConstant, ROLE_CONSTANT } from "./Auth.Constant";
import SendResponse from "../../../utils/SendResponse";
import { memberService } from "../Member/Member.Service";
import slugify from "slugify";
import { memberUtils } from "../Member/Member.Utils";
import { env_Constant } from "../../../constants/env.constant";
import EmailConsumerManager from "../../../infrastructure/email/Utils/EmailConsumers";
import EmailPublisher from "../../../infrastructure/email/Utils/Email.publisher";
import { cloudinaryUtils } from "../../../utils/Cloudinary.utils";

class AuthController {
  private async setAuthCookiesAndHeaders(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    console.log("Setting auth cookies and headers with tokens:", tokens);
    const isProd = env_Constant.NODE_ENV === "production";

    const commonOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict" as const,
    };

    // 1. Set Access Token (Short-lived)
    res.cookie("accessToken", tokens.accessToken, {
      ...commonOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    // 2. Set Refresh Token (Long-lived)
    // Optimization: Only send this cookie when the user hits the /refresh route
    res.cookie("refreshToken", tokens.refreshToken, {
      ...commonOptions,
      path: "/api/auth/refresh", // Browser only sends it to this specific URL
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  public CommunitySignUp = async (req: Request, res: Response) => {
    try {
      const {
        CommunityName,
        password,
        Bio,
        City,
        ContactPhone,
        Country,
        LogoUrl,
        OfficialEmail,
        Website,
        socialLinks,
        owner,
      } = req.body;

      let { path } = req.file || {};

      // If no uploaded file is provided (e.g., in tests), fall back to provided LogoUrl
      // or a safe default image instead of throwing an error.
      let cloudinary;
      if (path) {
        cloudinary = await cloudinaryUtils.uploadImage(String(path));
      } else {
        cloudinary = { secure_url: LogoUrl || "https://via.placeholder.com/150" };
      }

      if (OfficialEmail === owner.email) {
        throw Error("Official email cannot be the same as owner's email.");
      }

      let Auth = await authService.createUser({
        email: OfficialEmail,
        passwordHash: password,
        failedLoginAttempts: 0,
        isBanned: false,
        role: ROLE_CONSTANT.ORGANIZATION,
        emailVerified: false,
      });

      let findMember = await memberUtils.Is_Member_Exist(owner.email);

      if (!findMember) {
        await memberService.createNewMember({
          AuthId: String(Auth._id),
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
          primaryRole: ROLE_CONSTANT.ADMIN,
          location: owner.location,
          skills: owner.skills,
          areaOfInterest: owner.areaOfInterest,
          internalNotes: owner.internalNotes,
          imageUrl:
            "https://img.freepik.com/premium-vector/boy-with-sweater-that-says-hes-boy_1230457-43137.jpg?w=360",
          membershipStatus: "Active",
          onboardingSource: "website",
        });
      }

      let CreateNewCommunity = await communityService.createNewCommunity({
        OwnerID: String(Auth._id),
        CommunityName,
        Slug: slugify(CommunityName + "-" + crypto.randomUUID(), {
          lower: true,
          strict: true,
          trim: true,
        }),
        Bio,
        City,
        ContactPhone,
        Country,
        LogoUrl: cloudinary.secure_url,
        OfficialEmail,
        Website,
        Status: "pending",
        SocialLinks: socialLinks,
      });

      await permissionService.assignOrganizationPermissions(String(Auth._id));

      // Queue Community Signup Welcome Email
      await EmailPublisher.sendCommunitySignupEmail({
        email: OfficialEmail,
        communityName: CommunityName,
      });

      SendResponse.SuccessResponse(
        res,
        CreateNewCommunity,
        AuthConstant.COMMUNITY_ACCOUNT_CREATED,
      );
    } catch (error: unknown) {
      console.log(error);
      let message = "An error occurred";
      let errorData = error;
      if (error && typeof error === "object" && "issues" in error) {
        // Zod validation error
        message = "Validation failed";
        errorData = (error as any).issues || error;
      } else if (error instanceof Error) {
        message = error.message;
        errorData = error;
      } else {
        message = String(error);
      }
      SendResponse.ErrorResponse(res, errorData, message);
    }
  };

  public LoginUser = async (req: Request, res: Response) => {
    try {
      let { email, password } = req.body;

      let FindUser = await authUtils.FIND_USER_BY_EMAIL(email);

      if (!FindUser) {
        throw new Error(AuthConstant.USER_NOT_FOUND);
      }

      console.log("User found:", FindUser);

      let comparePass = await authUtils.comparePassword(
        password,
        FindUser.passwordHash,
      );

      console.log("Password comparison result:", comparePass);

      // if (!comparePass) {
      //   let failedLoginAttempts: number = await authUtils.failedLoginAttempts(
      //     String(FindUser._id),
      //   );

      //   if (failedLoginAttempts >= 5) {
      //     await authUtils.banUser(String(FindUser._id));

      //     // Queue account banned email
      //     const unbannedAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      //     await EmailPublisher.sendAccountBannedEmail({
      //       email: FindUser.email,
      //       unbannedAt,
      //     });
      //   } else {
      //     const attemptsLeft = 5 - failedLoginAttempts;
      //     throw new Error(
      //       `Invalid password. You have ${attemptsLeft} more attempt(s) before your account is temporarily banned for 30 min.`,
      //     );
      //   }
      // }

      const perms = await permissionService.getPermissionsForUser(
        String(FindUser._id),
      );

      console.log("User permissions:--->", perms);

      (req as Request & { userId?: string }).userId = String(FindUser._id);

      // 6. Generate token and set it in cookie and header (assuming this happens inside SendResponse.SuccessResponse or elsewhere)

      let { accessToken, refreshToken } = await authUtils.generateAuthTokens({
        _id: String(FindUser._id),
        email: FindUser.email,
        role: FindUser.role,
        ip: req.ip,
      });

      await this.setAuthCookiesAndHeaders(res, { accessToken, refreshToken });

      SendResponse.SuccessResponse(
        res,
        {
          FindUser,
          perms,
        },
        "Login successful.",
      );
    } catch (error: any) {
      SendResponse.ErrorResponse(res, error, error.message);
    }
  };

  public ForgotPassword = async (req: Request, res: Response) => {
    let email: string = req.body.email;

    try {
      let FindUser = await authUtils.FIND_USER_BY_EMAIL(email);
      if (!FindUser) {
        throw new Error(AuthConstant.USER_NOT_FOUND);
      }

      // Generate a password reset token (could be JWT or a random string stored in DB)
      const resetToken = jwt.sign(
        { userId: FindUser._id },
        env_Constant.JWT_ACCESS_SECRET,
        { expiresIn: "1h" },
      );

      const resetLink = `${env_Constant.FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}`;

      // Queue forgot password email
      await EmailPublisher.sendForgotPasswordEmail(email, resetLink);

      SendResponse.SuccessResponse(res, null, "Password reset email sent.");
    } catch (error: any) {
      SendResponse.ErrorResponse(res, error, error.message);
    }
  };

  public changePassword = async (req: Request, res: Response) => {
    let { email, token } = req.query;

    // This would be the endpoint hit when user clicks the reset link and submits new password
    // Implementation would involve verifying the reset token, allowing user to set new password, etc.
  };
}

export default new AuthController();
