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
        owner,
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
      } = req.body;

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
          isBanned: false,
          role: ROLE_CONSTANT.ORGANIZATION,
          emailVerified: false,
        });

        await permissionService.createPermission(
          Default_Organization_Permissions,
          String(Auth._id),
        );

        await memberService.createNewMember(owner);
      }

      SendResponse.SuccessResponse(
        res,
        CreateNewCommunity,
        AuthConstant.COMMUNITY_ACCOUNT_CREATED,
      );
    } catch (error) {}
  }
}

export default new AuthController();
