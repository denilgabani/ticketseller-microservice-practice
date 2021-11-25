import { Request, Response, Router } from "express";
const router = Router();

router.post("/api/tickets/new", async (req: Request, res: Response) => {
  res.status(200).send({});
});

export { router as createTicketRouter };
