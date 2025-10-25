export interface ICacheService {
  setData(key: string, ttl: number, value: string): Promise<void>;
  getData(key: string): Promise<string | null>;
  deleteData(key: string): Promise<void>;
}
