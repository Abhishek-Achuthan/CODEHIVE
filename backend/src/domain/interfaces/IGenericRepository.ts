export interface IGenericRepository<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  find(id: string): Promise<T | null>
}
