export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Adding this because we are extending built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { error: string; field?: string }[];
}
