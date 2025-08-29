import z, { email } from "zod";
import { zPhoneNumber } from "./utils/phone";
import { zName } from "./utils/name";
import { zPassword } from "./utils/password";

export const RegisterSchema = z.object({
    email:z.email(),
    phone:zPhoneNumber,
    first_name:zName,
    last_name:zName,
    password:zPassword
})