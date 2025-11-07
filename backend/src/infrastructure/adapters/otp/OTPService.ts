import { IOTPService } from '../../../application/ports/otp/IOTPService';

export class OTPService implements IOTPService {
  genarateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
