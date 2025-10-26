export interface IHashService {
  hash(value: string): Promise<string>;
  compare(value: string, hashedValue: string): Promise<boolean>;
}
