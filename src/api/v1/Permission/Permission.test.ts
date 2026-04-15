import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import { Event_Permissions } from "./Permission.constant";
import { permissionService } from "./Permission.service";

describe("Check Permission API", () => {
  it("should match all Event Permission constants", () => {
    expect(Event_Permissions.CREATE_EVENT).toBe("event:create");
    expect(Event_Permissions.UPDATE_EVENT).toBe("event:update");
    expect(Event_Permissions.DELETE_EVENT).toBe("event:delete");
    expect(Event_Permissions.VIEW_EVENT).toBe("event:view");
    expect(Event_Permissions.PUBLISH_EVENT).toBe("event:publish");
    expect(Event_Permissions.JOIN_EVENT).toBe("event:join");
    expect(Event_Permissions.LEAVE_EVENT).toBe("event:leave");
  });
});

describe("Get Default Permissions for Role", () => {
  it("should return valid permissions for PARTICIPANT role", async () => {
    const role = "participant";

    const permissions =
      await permissionService.get_DefaultPermissionsForRole(role);

    expect(permissions).toBeDefined();
    expect(Array.isArray(permissions)).toBe(true);
  });

  it("should return valid permissions for MENTOR role", async () => {
    const role = "mentor";

    const permissions =
      await permissionService.get_DefaultPermissionsForRole(role);

    expect(permissions).toBeDefined();
  });

  it("should return valid permissions for ORGANIZATION role", async () => {
    const role = "organization";

    const permissions =
      await permissionService.get_DefaultPermissionsForRole(role);

    expect(permissions).toBeDefined();
    expect(Array.isArray(permissions)).toBe(true);
  });
});
