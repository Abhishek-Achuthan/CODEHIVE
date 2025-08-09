export class EmailAlreadyInUseError extends Error {
  constructor() {
    super("Email is already in use.");
    this.name = "EmailAlreadyInUseError";
  }
}
