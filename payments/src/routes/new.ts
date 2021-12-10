import { authorize, requestValidator } from "@dgticketseller/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/payments",
  authorize,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  requestValidator,
  async (req: Request, res: Response) => {
    res.status(200).send({ success: true });
  }
);

export { router as newPaymentRouter };
