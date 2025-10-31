export abstract class BaseError extends Error {
  public readonly _statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this._statusCode = statusCode;

    Object.setPrototypeOf(this,new.target.prototype);
  };
}
