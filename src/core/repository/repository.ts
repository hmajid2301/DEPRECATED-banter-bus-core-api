import { getModelForClass, mongoose, ReturnModelType, types } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { FilterQuery } from 'mongoose';

export interface Repository<T, _> {
  Create(doc: T): void;
  Get(id: string): Promise<T | null>;
  Update(id: string, doc: T): Promise<boolean>;
  Delete(id: string): Promise<boolean>;
}

export class BaseRepository<T, U extends AnyParamConstructor<T> = AnyParamConstructor<T>> implements Repository<T, U> {
  private model: ReturnModelType<U, T>;

  constructor(model: U, username: string, password: string, host: string, port: number, dbName: string, authDB = '') {
    let uri = `mongodb://${username}:${password}@${host}:${port}/${dbName}`;
    if (authDB !== '') {
      uri += `?authSource=${authDB}`;
    }

    mongoose.connect(uri);
    this.model = getModelForClass(model);
  }

  public async Create(doc: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.model
        .create(doc)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  public async Get(id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.model
        .findOne({ id } as FilterQuery<types.DocumentType<InstanceType<U>, T>>)
        .then((result) => resolve(result?.toJSON() as T))
        .catch((err) => reject(err));
    });
  }

  public async Update(id: string, doc: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.model
        .updateOne({ id } as FilterQuery<types.DocumentType<InstanceType<U>, T>>, doc)
        .then((result) => resolve(!!result.modifiedCount))
        .catch((err) => reject(err));
    });
  }

  public async Delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.model
        .deleteOne({ id } as FilterQuery<types.DocumentType<InstanceType<U>, T>>)
        .then((result) => resolve(!!result.deletedCount))
        .catch((err) => reject(err));
    });
  }
}
