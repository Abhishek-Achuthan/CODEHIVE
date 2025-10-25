import { IGenericRepository } from "../../../domain/interfaces/IGenericRepository";
import { Document, Model } from "mongoose";

export abstract class GenericRepository<T extends Document>
  implements IGenericRepository<T>
{
  private readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(data: T): Promise<T> {
    return await this._model.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, data);
  }

  async delete(id: string): Promise<T | null> {
    return await this._model.findByIdAndDelete(id);
  }

  async getAll(): Promise<T[] | null> {
    return await this._model.find();
  }
}
