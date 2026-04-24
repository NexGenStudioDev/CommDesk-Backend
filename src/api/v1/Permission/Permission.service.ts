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

  public async assignOrganizationPermissions(userId: string) {
    // 1. Remove duplicate permissions (based on resource)
    const uniquePermissions = Array.from(
      new Map(
        Default_Organization_Permissions.map((p) => [p.resource, p]),
      ).values(),
    );

    // 2. Attach userId
    const formattedPermissions = uniquePermissions.map((permission) => ({
      ...permission,
      userId,
    }));

    // 3. Insert into DB (skip duplicates safely)
    const createdPermissions = await Permission.insertMany(
      formattedPermissions,
      { ordered: false },
    );

    return createdPermissions;
  }
}

export const permissionService = new PermissionService();
