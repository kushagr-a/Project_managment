import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendVerificationEmail
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator, userLoginValidator } from "../validators/index.js"
import { verifyJwt } from "../middlewares/authMiddleware.js"

const authRouter = Router();

authRouter.route("/register").post(
    userRegisterValidator(),
    validate,
    registerUser
);

authRouter.route("/login").post(
    userLoginValidator(),
    validate,
    loginUser
)

authRouter.route("/currentUser").get(verifyJwt, getCurrentUser)

authRouter.route("/logout").post(verifyJwt, logoutUser)

authRouter.route("/verify-email/:verificationToken").get(verifyEmail)

authRouter.route("/resend-verification-email").post(verifyJwt, resendVerificationEmail)

export default authRouter;
