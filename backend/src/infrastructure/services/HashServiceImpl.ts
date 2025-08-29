import { IHashService } from "../../application/services/IHashservice";
import bcrypt from "bcrypt";

export class HashServiceImpl implements IHashService {
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain,10);
    }
    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain,hash);
    }
}