import { z } from "zod";
import { zPassword } from "./utils/password";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: zPassword,
});

export type LoginRequest = z.infer<typeof loginSchema>;
