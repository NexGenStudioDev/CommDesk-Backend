import SupperTest from "supertest";
import {
  afterAll,
  beforeAll,
  describe,
  afterEach,
  expect,
  it,
} from "@jest/globals";
import { Event_Permissions } from "./Permission.constant";

describe("Check Permission API", () => {
  it("Check Event Permissions Constants to Match Expected Values", () => {
    expect(Event_Permissions.CREATE_EVENT).toBe("event:create");
    expect(Event_Permissions.UPDATE_EVENT).toBe("event:update");
    expect(Event_Permissions.DELETE_EVENT).toBe("event:delete");
    expect(Event_Permissions.VIEW_EVENT).toBe("event:view");
    expect(Event_Permissions.PUBLISH_EVENT).toBe("event:publish");
    expect(Event_Permissions.JOIN_EVENT).toBe("event:join");
    expect(Event_Permissions.LEAVE_EVENT).toBe("event:leave");
    console.log("All Event Permissions Constants are correct ✔️.");
  });
});
