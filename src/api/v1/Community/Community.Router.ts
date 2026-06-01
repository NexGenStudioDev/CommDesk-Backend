import { Router } from "express";

import { communityController } from "./Community.Controller";

const router = Router();

router.get(
  "/get-community-by-auth-id",
  communityController.GET_COMMUNITY_BY_AuthID,
);

export { router as communityRouter };
