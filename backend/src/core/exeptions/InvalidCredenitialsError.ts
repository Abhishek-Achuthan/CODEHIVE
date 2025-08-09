export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials provided.");
    this.name = "InvalidCredentialsError";
  }
}
