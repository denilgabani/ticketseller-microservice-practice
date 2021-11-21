import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("You are not authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ error: "You are not authorized" }];
  }
}
