import { Router } from "express";
const route = Router();

/*
   Import All Routes
*/

import { AuthRoute } from "../api/v1/Auth/Auth.routes";
import { MemberRoutes } from "../api/v1/Member/Member.routes";
import { PermissionRoutes } from "../api/v1/Permission/Permission.routes";
import { communityRouter } from "../api/v1/Community/Community.Router";

route.use(
  "/api/v1",
  AuthRoute,
  MemberRoutes,
  PermissionRoutes,
  communityRouter,
);

export { route };
