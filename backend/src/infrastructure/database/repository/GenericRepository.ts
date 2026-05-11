






import { IGenericRepository } from '../../../domain/interfaces/IGenericRepository';
import { Document, Model } from 'mongoose';

export abstract class GenericRepository<T extends Document, E>
  implements IGenericRepository<E>
{
  protected readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }
  
  async create(data: Partial<E>): Promise<E> {
    const docData = this.toDocument(data);
    const doc = await this._model.create(docData);
    return this.toEntity(doc as T);
  }

  async update(id: string, data: Partial<E>): Promise<E | null> {
    const docData = this.toDocument(data);
    const updated = await this._model.findByIdAndUpdate(id, docData, { new: true });
    return updated ? this.toEntity(updated as T) : null;
  }

  async delete(id: string): Promise<E | null> {
    const deleted = await this._model.findByIdAndDelete(id);
    return deleted ? this.toEntity(deleted as T) : null;
  }

  async getAll(): Promise<E[]> {
    const docs = await this._model.find();
    return docs.map((d) => this.toEntity(d as T));
  }

  async find(id: string): Promise<E | null> {
    const doc = await this._model.findById(id);
    return doc ? this.toEntity(doc as T) : null;
  }

  protected abstract toEntity(doc: T): E;

  protected abstract toDocument(data: Partial<E>): Partial<T>;
}
