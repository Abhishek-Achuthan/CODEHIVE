import * as z from "zod";

const nameRegex = /^[a-zA-Z\s-]+$/;

export const zName = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(nameRegex, "Name can only contain letters, spaces, and hyphens");