import { Request, Response } from "express";
import SendResponse from "../../../utils/SendResponse";
import { permissionService } from "./Permission.service";

class PermissionController {
  async getUserPermissions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const perms = await permissionService.getPermissionsForUser(userId);
      return SendResponse.SuccessResponse(
        res,
        perms,
        "User permissions retrieved",
      );
    } catch (error: any) {
      return SendResponse.ErrorResponse(
        res,
        error,
        error?.message || "Failed to get permissions",
      );
    }
  }

  async addPermissions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const body = req.body;
      if (!Array.isArray(body)) {
        return SendResponse.ErrorResponse(
          res,
          null,
          "Expected array of permissions",
        );
      }
      const result = await permissionService.createPermission(body, userId);
      return SendResponse.SuccessResponse(
        res,
        result,
        "Permissions added/updated",
      );
    } catch (error: any) {
      return SendResponse.ErrorResponse(
        res,
        error,
        error?.message || "Failed to add permissions",
      );
    }
  }

  async assignOrganization(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result =
        await permissionService.assignOrganizationPermissions(userId);
      return SendResponse.SuccessResponse(
        res,
        result,
        "Organization permissions assigned",
      );
    } catch (error: any) {
      return SendResponse.ErrorResponse(
        res,
        error,
        error?.message || "Failed to assign organization permissions",
      );
    }
  }

  async checkPermission(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { name, minLevel } = req.query as any;
      if (!name)
        return SendResponse.ErrorResponse(res, null, "name query required");
      const ok = await permissionService.check_UserPermissionWithLevel(
        userId,
        name,
        Number(minLevel) || 0,
      );
      return SendResponse.SuccessResponse(
        res,
        { hasPermission: ok },
        "Permission check completed",
      );
    } catch (error: any) {
      return SendResponse.ErrorResponse(
        res,
        error,
        error?.message || "Failed to check permission",
      );
    }
  }

  async removePermission(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { resource } = req.body;
      if (!resource)
        return SendResponse.ErrorResponse(res, null, "resource required");
      const result = await permissionService.removePermissionFromUser(
        userId,
        resource,
      );
      return SendResponse.SuccessResponse(res, result, "Permission removed");
    } catch (error: any) {
      return SendResponse.ErrorResponse(
        res,
        error,
        error?.message || "Failed to remove permission",
      );
    }
  }
}

export const permissionController = new PermissionController();
