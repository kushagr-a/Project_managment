import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator, userLoginValidator } from "../validators/index.js"

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

export default authRouter;
