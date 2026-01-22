import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator, userLoginValidator } from "../validators/index.js"
import {verifyJwt} from "../middlewares/authMiddleware.js"

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

authRouter.route("/logout").post(verifyJwt, logoutUser)

export default authRouter;
