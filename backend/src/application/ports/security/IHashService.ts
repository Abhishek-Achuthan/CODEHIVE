export interface IHashService {
  hash(value: string): Promise<void>;
  compare(value: string, hashedValue: string): Promise<boolean>;
}
