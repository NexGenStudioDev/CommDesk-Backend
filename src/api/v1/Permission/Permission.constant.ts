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

export const memberPermission = {
  CREATE_MEMBER: "member:create",
  UPDATE_MEMBER: "member:update",
  DELETE_MEMBER: "member:delete",
  VIEW_MEMBER: "member:view",
};

export const Default_Organization_Permissions: PermissionSchemaType[] = [
  {
    name: memberPermission.VIEW_MEMBER,
    action: "read",
    resource: "organization",
  },
  {
    name: memberPermission.UPDATE_MEMBER,
    action: "update",
    resource: "organization",
  },
  {
    name: memberPermission.DELETE_MEMBER,
    action: "delete",
    resource: "organization",
  },
  {
    name: memberPermission.CREATE_MEMBER,
    action: "create",
    resource: "create New Member",
    description: "Permission to create new members in the organization",
  },
];

export const Default_Member_Permissions: PermissionSchemaType[] = [
  {
    name: memberPermission.VIEW_MEMBER,
    action: "read",
    resource: "View Member",
  },
];
