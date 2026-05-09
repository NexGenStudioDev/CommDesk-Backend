import { Request, Response } from "express";
import { permissionService } from "../Permission/Permission.service";
import jwt from "jsonwebtoken";
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

class AuthController {
  private async setAuthCookiesAndHeaders(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
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

  public async CommunitySignUp(req: Request, res: Response) {
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

      let CreateNewCommunity = await communityService.createNewCommunity({
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
        LogoUrl,
        OfficialEmail,
        Website,
        Status: "pending",
        SocialLinks: socialLinks,
      });

      if (CreateNewCommunity) {
        let Auth = await authService.createUser({
          email: CreateNewCommunity.OfficialEmail,
          passwordHash: await authUtils.hashPassword(password),
          failedLoginAttempts: 0,
          isBanned: false,
          role: ROLE_CONSTANT.ORGANIZATION,
          emailVerified: false,
        });

        await permissionService.assignOrganizationPermissions(String(Auth._id));

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
      }

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
  }

  public async LoginUser(req: Request, res: Response) {
    try {
      let { email, password } = req.body;

      let FindUser = await authUtils.FIND_USER_BY_EMAIL(email);

      if (!FindUser) {
        throw new Error(AuthConstant.USER_NOT_FOUND);
      }

      let comparePass = await authUtils.comparePassword(
        password,
        FindUser.passwordHash,
      );

      if (!comparePass) {
        let failedLoginAttempts: number = await authUtils.failedLoginAttempts(
          String(FindUser._id),
        );

        if (failedLoginAttempts >= 5) {
          await authUtils.banUser(String(FindUser._id));
          throw new Error(
            `Your account has been temporarily banned due to ${failedLoginAttempts} failed login attempts. Please try again later or contact support.`,
          );
        } else {
          const attemptsLeft = 5 - failedLoginAttempts;
          throw new Error(
            `Invalid password. You have ${attemptsLeft} more attempt(s) before your account is temporarily banned for 45 min.`,
          );
        }
      }

      // 6. Generate token and set it in cookie and header (assuming this happens inside SendResponse.SuccessResponse or elsewhere)

      let {accessToken , refreshToken } = await authUtils.generateAuthTokens({
        _id: String(FindUser._id),
        email: FindUser.email,
        role: FindUser.role,
        ip: req.ip,
      });

      this.setAuthCookiesAndHeaders(res, { accessToken, refreshToken });

      SendResponse.SuccessResponse(res, FindUser, "Login successful.");
    } catch (error: any) {
      SendResponse.ErrorResponse(res, error, error.message);
    }
  }

  public async ForgotPassword(req: Request, res: Response) {}
}

export default new AuthController();
