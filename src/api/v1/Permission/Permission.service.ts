import { ROLE_CONSTANT } from "../Auth/Auth.Constant";
import {
  Mentor_Permissions,
  Default_Participant_Permissions,
  Default_Organization_Permissions,
} from "./Permission.constant";
import { Permission, PermissionSchemaType } from "./Permission.model";

class PermissionService {
  public async get_DefaultPermissionsForRole(
    role: string,
  ): Promise<PermissionSchemaType[] | object | []> {
    let getPermissions =
      ROLE_CONSTANT.PARTICIPANT === role
        ? Default_Participant_Permissions
        : ROLE_CONSTANT.MENTOR === role
          ? Mentor_Permissions
          : ROLE_CONSTANT.ORGANIZATION === role
            ? Default_Organization_Permissions
            : [];

    return getPermissions;
  }

  public async check_UserPermission(userId: string, permissionName: string) {
    const permission = await Permission.findOne({
      userId,
      name: permissionName,
    });
    console.log("Permission found:", permission);
    return !!permission; // Return true if permission exists, false otherwise
  }

  public async createPermission(
    permissionData: PermissionSchemaType[],
    userId: string,
  ) {
    const formattedData = permissionData.map((permission) => ({
      ...permission,
      userId,
    }));

    const newPermissions = await Permission.insertMany(formattedData, {
      ordered: false,
    });

    return newPermissions;
  }
}

export const permissionService = new PermissionService();
