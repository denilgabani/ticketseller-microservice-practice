import { Request, Response, NextFunction } from "express";
import { CustomError } from "../error/customError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.error(err.stack);
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  //   When error occurred other than Custom classes of error, but still
  //   we will define the same structure for errors as CustomError
  return res.status(400).send({
    errors: [
      {
        error: err.message,
      },
    ],
  });
};

export default errorHandler;
