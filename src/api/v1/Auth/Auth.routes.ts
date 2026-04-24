import { Router } from "express";
const router = Router();
import AuthController from "./Auth.Controller";

router.post("/signup/community", AuthController.CommunitySignUp);

export { router as AuthRoute };
