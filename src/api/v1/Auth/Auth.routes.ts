import { Router } from "express";
const router = Router();
import AuthController from "./Auth.Controller";

router.post("/signup/community", AuthController.CommunitySignUp);

router.post("/signIn", AuthController.LoginUser);

export { router as AuthRoute };
