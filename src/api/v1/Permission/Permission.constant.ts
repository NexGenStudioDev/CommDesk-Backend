import { PermissionSchemaType } from "./Permission.model";

export const Event_Permissions = {
  CREATE_EVENT: "event:create",
  UPDATE_EVENT: "event:update",
  DELETE_EVENT: "event:delete",
  VIEW_EVENT: "event:view",
  PUBLISH_EVENT: "event:publish",
  JOIN_EVENT: "event:join",
  LEAVE_EVENT: "event:leave",
};

export const User_Permissions = {
  READ_USERS: "user:read",
  VIEW_USERS: "user:view",
  DELETE_USERS: "user:delete",
  UPDATE_USERS: "user:update",
};

export const Organization_Permissions = {
  VIEW_ORGANIZATIONS: "organization:view",
  DELETE_ORGANIZATIONS: "organization:delete",
  UPDATE_ORGANIZATIONS: "organization:update",
};

export const Judge_Permissions = {
  ASSIGN_JUDGES: "judge:assign",
  ADD_JUDGES: "judge:add",
  REMOVE_JUDGES: "judge:remove",
  VIEW_JUDGES: "judge:view",
  DELETE_JUDGES: "judge:delete",
  UPDATE_JUDGES: "judge:update",
};

export const Participant_Permissions = {
  MANAGE_PARTICIPANTS: "participant:manage",
  VIEW_PARTICIPANTS: "participant:view",
  DELETE_PARTICIPANTS: "participant:delete",
  UPDATE_PARTICIPANTS: "participant:update",
};

export const Mentor_Permissions = {
  MANAGE_MENTORS: "mentor:manage",
  VIEW_MENTORS: "mentor:view",
  DELETE_MENTORS: "mentor:delete",
  UPDATE_MENTORS: "mentor:update",
};

export const Default_Participant_Permissions: PermissionSchemaType[] = [
  {
    name: "View Event",
    action: "read",
    resource: Event_Permissions.VIEW_EVENT,
    description: "Permission to view events",
    userId: null,
  },
  {
    name: "Join Event",
    action: "update",
    resource: Event_Permissions.JOIN_EVENT,
    description: "Permission to join events",
    userId: null,
  },
  {
    name: "Leave Event",
    action: "update",
    resource: Event_Permissions.LEAVE_EVENT,
    description: "Permission to leave events",
    userId: null,
  },
];

export const Default_Organization_Permissions: PermissionSchemaType[] = [
  {
    name: "Create Event",
    action: "create",
    resource: Event_Permissions.CREATE_EVENT,
    description: "Permission to create events",
    userId: null,
  },

  {
    name: "Update Event",
    action: "update",
    resource: Event_Permissions.UPDATE_EVENT,
    description: "Permission to update events",
    userId: null,
  },
  {
    name: "Delete Event",
    action: "delete",
    resource: Event_Permissions.DELETE_EVENT,
    description: "Permission to delete events",
    userId: null,
  },
  {
    name: "View Event",
    action: "read",
    resource: Event_Permissions.VIEW_EVENT,
    description: "Permission to view events",
    userId: null,
  },
  {
    name: "Publish Event",
    action: "update",
    resource: Event_Permissions.PUBLISH_EVENT,
    description: "Permission to publish events",
    userId: null,
  },
  {
    name: "Delete Event",
    action: "delete",
    resource: Event_Permissions.DELETE_EVENT,
    description: "Permission to delete events",
    userId: null,
  },

  {
    name: "Delete User",
    action: "delete",
    resource: User_Permissions.DELETE_USERS,
    description: "Permission to delete users",
    userId: null,
  },
  {
    name: "Read User",
    action: "read",
    resource: User_Permissions.READ_USERS,
    description: "Permission to read user information",
    userId: null,
  },
  {
    name: "View Organization",
    action: "read",
    resource: Organization_Permissions.VIEW_ORGANIZATIONS,
    description: "Permission to view organizations",
    userId: null,
  },
  {
    name: "Update Organization",
    action: "update",
    resource: Organization_Permissions.UPDATE_ORGANIZATIONS,
    description: "Permission to update organizations",
    userId: null,
  },
];
