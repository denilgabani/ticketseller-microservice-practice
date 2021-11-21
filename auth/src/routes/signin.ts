import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../error/requestValidationError";

const router = Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password").trim().notEmpty().withMessage("Please enter the password"),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }
  }
);

export { router as signInRouter };
