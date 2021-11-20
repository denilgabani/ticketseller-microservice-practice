import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../error/requestValidationError";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    console.log(errors.array());
    res.status(200).send({});
  }
);

export { router as signUpRouter };
