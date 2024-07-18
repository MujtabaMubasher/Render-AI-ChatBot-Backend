import { NextFunction, Request, Response } from "express"
import { body, ValidationChain, validationResult } from "express-validator"

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) =>{
        for ( const validation of validations) {
           const result =  await validation.run(req)
           if (!result.isEmpty()) {
               break;
           }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }else{
            return res.status(422).json({errors: errors.array()})
        }
    }
}

const loginValidate = [
    body("email").notEmpty().trim().isEmail().withMessage("Email is required"),
    body("password").
    notEmpty().trim().
    isLength({min:6}).
    withMessage("Password Should be at least 6 characters")
]

const signUpValidate = [
    body("username").notEmpty().withMessage("Name is Required"),
    ...loginValidate
]

const chatMsgValidator = [
    body("message").notEmpty().withMessage("Message is required")
]


export {validate,signUpValidate, loginValidate,chatMsgValidator}