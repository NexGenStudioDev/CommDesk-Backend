import { Router } from "express";
const router = Router();
import AuthController from "./Auth.Controller";

router.post("/signup/community", AuthController.CommunitySignUp);

router.post("/signIn", AuthController.LoginUser);

router.post("/forgot-password", AuthController.ForgotPassword);

router.post("/reset-password", AuthController.changePassword);

export { router as AuthRoute };
