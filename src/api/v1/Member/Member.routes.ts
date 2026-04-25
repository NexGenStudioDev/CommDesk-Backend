import { Router } from "express";
const route = Router();

import { memberController } from "./Member.Controller";

route.post("/create/newMember", memberController.createNewMember);

export { route as MemberRoutes };
