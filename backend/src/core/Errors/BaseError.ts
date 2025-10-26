export abstract class BaseError extends Error {
  private _statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this._statusCode = statusCode;

    Object.setPrototypeOf(this,BaseError.prototype);
  };
}
