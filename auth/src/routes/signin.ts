import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import {
  BadRequestError,
  RequestValidationError,
  requestValidator,
} from "@dgticketseller/common";

import { User } from "../models/User";
import { Password } from "../utils/password";
import jwt from "jsonwebtoken";

const router = Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password").trim().notEmpty().withMessage("Please enter the password"),
  ],
  requestValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(new BadRequestError("Invalid credentials"));
    }

    const isPwdMatch = await Password.compare(existingUser.password, password);

    if (!isPwdMatch) {
      return next(new BadRequestError("Invalid credentials"));
    }

    // Generate jsonwebtoken
    const userToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = { jwt: userToken };

    return res.status(200).json(existingUser);
  }
);

export { router as signInRouter };
