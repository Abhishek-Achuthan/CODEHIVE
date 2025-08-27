import parsePhoneNumber from "libphonenumber-js";
import * as z from "zod";

export const zPhoneNumber = z.string().transform((value, ctx) => {
  try {
    const phoneNumber = parsePhoneNumber(value, "IN");

    if (!phoneNumber?.isValid() || phoneNumber.country !== "IN") {
      ctx.addIssue({
        code: "custom",
        message: "Invalid Indian phone number",
      });
      return z.NEVER;
    }

    return phoneNumber.formatInternational(); 
  } catch {
    ctx.addIssue({
      code: "custom",
      message: "Invalid phone number format",
    });
    return z.NEVER;
  }
});
