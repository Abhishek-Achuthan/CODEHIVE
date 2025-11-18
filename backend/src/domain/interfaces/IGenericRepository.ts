export interface IGenericRepository<E> {
  create(data: Partial<E>): Promise<E>;
  update(id: string, data: Partial<E>): Promise<E | null>;
  delete(id: string): Promise<E | null>;
  getAll(): Promise<E[]>;
  find(id: string): Promise<E | null>
}
