import { Request, Response } from "express";
import { permissionService } from "../Permission/Permission.service";
import { Event_Permissions } from "../Permission/Permission.constant";
import SendResponse from "../../../utils/SendResponse";

class EventController {
  createNewEvent = async (req: Request, res: Response) => {
    try {
      let userId = (req as Request & { userId?: string }).userId;

      if (!userId) {
        throw new Error(
          "User ID is missing from the request. Ensure authentication middleware is properly set up to attach userId to the request object.",
        );
      }

      let checkPermissions = permissionService.check_UserPermission(
        userId,
        Event_Permissions.CREATE_EVENT,
      );
      if (!checkPermissions) {
        return res.status(403).json({
          message: "Forbidden: You don't have permission to create an event.",
        });
      }
    } catch (error) {
      SendResponse.ErrorResponse(res, {
        error: error instanceof Error ? error.message : "Unknown error",
        message: "An error occurred while creating the event.",
      });
    }
  };
}

export const eventController = new EventController();
