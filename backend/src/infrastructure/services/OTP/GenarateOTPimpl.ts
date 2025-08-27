import { IGenarateOtp } from "../../../application/services/OTP/IGenarateOTP";
import { randomInt } from "crypto";

export class GenarateOTPimpl implements IGenarateOtp {
  async genarateOtp(): Promise<string> {
    return randomInt(100000, 999999).toString();
  }
}
