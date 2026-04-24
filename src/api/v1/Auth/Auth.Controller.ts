import { Request, Response } from "express";
import { permissionService } from "../Permission/Permission.service";
import slug from "slug";
import { Default_Organization_Permissions } from "../Permission/Permission.constant";
import { communityService } from "../Community/Community.Service";
import { authService } from "./Auth.Service";
import { authUtils } from "./Auth.Utils";
import { AuthConstant, ROLE_CONSTANT } from "./Auth.Constant";
import SendResponse from "../../../utils/SendResponse";
import { memberService } from "../Member/Member.Service";

class AuthController {
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

      console.log("req body ->", req.body);

      let CreateNewCommunity = await communityService.createNewCommunity({
        CommunityName,
        Slug: slug(CommunityName + crypto.randomUUID()),
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
          imageUrl: "https://img.freepik.com/premium-vector/boy-with-sweater-that-says-hes-boy_1230457-43137.jpg?w=360",  
          membershipStatus: "Active",
          onboardingSource: "website",
        });
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
}

export default new AuthController();
