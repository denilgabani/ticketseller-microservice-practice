import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../error/requestValidationError";
import { requestValidator } from "../middleware/validator";

const router = Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password").trim().notEmpty().withMessage("Please enter the password"),
  ],
  requestValidator,
  (req: Request, res: Response, next: NextFunction) => {}
);

export { router as signInRouter };
