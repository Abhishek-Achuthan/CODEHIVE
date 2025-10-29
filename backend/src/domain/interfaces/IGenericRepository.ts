export interface IGenericRepository<T, E> {
  create(data: Partial<T>): Promise<E>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  find(id: string): Promise<T | null>
}
