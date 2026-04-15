import { Default_Organization_Permissions } from "./Permission.constant";
import { Permission } from "./Permission.model";

class PermissionUtils {
  static async createOrganizationPermissions(userId: string) {
    const permissions = Default_Organization_Permissions.map((permission) => ({
      ...permission,
      userId: userId,
    }));
    await Permission.insertMany(permissions);
  }
}
