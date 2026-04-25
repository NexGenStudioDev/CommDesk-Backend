import { Router } from "express";
const route = Router();

/*
   Import All Routes
*/

import { AuthRoute } from "../api/v1/Auth/Auth.routes";
import { MemberRoutes } from "../api/v1/Member/Member.routes";

route.use("/api/v1", AuthRoute, MemberRoutes);

export { route };
