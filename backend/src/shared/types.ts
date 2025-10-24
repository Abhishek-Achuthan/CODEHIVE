declare module "jsonwebtoken" {
  export interface JwtPayload {
    userRole?: string;
    type?: string;
  }
}
