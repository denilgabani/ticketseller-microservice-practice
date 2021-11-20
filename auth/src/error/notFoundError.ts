import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Provided route is not found");

    // Adding this because we are extending built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      {
        error: "Provided route is not found please check the path again.",
      },
    ];
  }
}
