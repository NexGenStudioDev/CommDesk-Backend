import { ROLE_CONSTANT } from "../Auth/Auth.Constant";
import { Default_Organization_Permissions } from "./Permission.constant";
import { Permission, PermissionSchemaType } from "./Permission.model";
import { permissionUtils } from "./Permission.utils";

class PermissionService {
  public async get_DefaultPermissionsForRole(
    role: string,
  ): Promise<PermissionSchemaType[] | object | []> {
    let getPermissions =
      ROLE_CONSTANT.ORGANIZATION === role
        ? Default_Organization_Permissions
        : [];

    return getPermissions;
  }

  public async check_UserPermission(userId: string, permissionName: string) {
    const doc = await Permission.findOne({
      userId,
      permission: { $elemMatch: { name: permissionName } },
    });
    return !!doc;
  }

  public async createPermission(
    permissionData: PermissionSchemaType[],
    userId: string,
  ) {
    const normalized = permissionUtils.normalizePermissions(
      permissionData as any,
    );
    const deduped = permissionUtils.dedupeByResource(normalized);

    // Upsert: add to user's permission array, avoiding duplicates
    const res = await Permission.updateOne(
      { userId },
      { $addToSet: { permission: { $each: deduped } } },
      { upsert: true },
    );

    return res;
  }

  public async assignOrganizationPermissions(userId: string) {
    const defaultPerms = await this.get_DefaultPermissionsForRole(
      ROLE_CONSTANT.ORGANIZATION,
    );

    await Permission.updateOne(
      { userId },
      { $addToSet: { permission: { $each: defaultPerms } } },
      { upsert: true },
    ).exec();
  }

  public async getPermissionsForUser(userId: string) {
    console.log("Fetching permissions for userId:-->", userId);
    const doc = await Permission.findOne({ userId }).lean();
    return doc?.permission || [];
  }

  public async removePermissionFromUser(userId: string, resource: string) {
    const res = await Permission.updateOne(
      { userId },
      { $pull: { permission: { resource } } },
    );
    return res;
  }

  public async check_UserPermissionWithLevel(
    userId: string,
    permissionName: string,
    minLevel = 0,
  ) {
    const doc = await Permission.findOne({
      userId,
      permission: {
        $elemMatch: {
          name: permissionName,
          level: { $gte: permissionUtils.clampLevel(minLevel) },
        },
      },
    });
    return !!doc;
  }
}

export const permissionService = new PermissionService();
