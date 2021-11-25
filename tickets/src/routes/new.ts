import { authorize, requestValidator } from "@dgticketseller/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
const router = Router();

router.post(
  "/api/tickets",
  authorize,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  requestValidator,
  async (req: Request, res: Response) => {
    res.status(200).send({});
  }
);

export { router as createTicketRouter };
