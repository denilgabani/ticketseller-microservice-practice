import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";
import {
  BadRequestError,
  RequestValidationError,
  requestValidator,
} from "@dgticketseller/common";

import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 16 })
      .withMessage("Please enter valid password of legnth between 6 to 16"),
  ],
  requestValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const userExist = await User.findOne({ email });

      if (userExist) {
        return next(new BadRequestError("Email is already in use"));
      }

      const user = User.build({ email, password });
      await user.save();

      // Generate jsonwebtoken
      const userToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );

      // Store it on session object
      req.session = { jwt: userToken };

      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
    }
  }
);

export { router as signUpRouter };
