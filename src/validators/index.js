import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username required in lowercase ")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characterstics "),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),

        body("fullname")
            .trim()
            .optional()
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]
}

export {
    userRegisterValidator,
    userLoginValidator
}