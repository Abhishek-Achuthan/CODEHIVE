import bcrypt from "bcrypt";
import { IHashService } from "../../../application/ports/security/IHashService";

export class HashService implements IHashService {
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
  }
}
