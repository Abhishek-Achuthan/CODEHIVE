export class UserCreationError extends Error {
  constructor() {
    super("Failed to create user");
    this.name = "UserCreationError";
  }
}
