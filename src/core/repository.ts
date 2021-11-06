import { getModelForClass, mongoose, ReturnModelType, types } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { rejects } from 'assert';
import { FilterQuery } from 'mongoose';

export interface Repository<T> {
  Create(doc: T): Promise<T>;
  Get(id: string): Promise<T | null>;
  Update(id: string, doc: T): Promise<T | null>;
  Delete(id: string): Promise<T | null>;
  CloseConnection(): Promise<void>;
  Clear(): Promise<void>;
}

export class BaseRepository<T, U extends AnyParamConstructor<T> = AnyParamConstructor<T>> implements Repository<T> {
  protected model: ReturnModelType<U, T>;

  private dbConnection: Promise<typeof mongoose>;

  constructor(model: U, username: string, password: string, host: string, port: number, dbName: string, authDB = '') {
    let uri = `mongodb://${username}:${password}@${host}:${port}/${dbName}`;
    if (authDB !== '') {
      uri += `?authSource=${authDB}`;
    }

    this.dbConnection = mongoose.connect(uri);
    this.model = getModelForClass(model);
  }

  public async Create(doc: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model
        .create(doc)
        .then((result) => resolve(result?.toJSON() as T))
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

  public async Update(id: string, doc: T): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.model
        .findOneAndUpdate({ id } as FilterQuery<types.DocumentType<InstanceType<U>, T>>, doc, {
          new: true,
        })
        .then((result) => resolve(result?.toJSON() as T))
        .catch((err) => reject(err));
    });
  }

  public async Delete(id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.model
        .findOneAndDelete({ id } as FilterQuery<types.DocumentType<InstanceType<U>, T>>)
        .then((result) => resolve(result?.toJSON() as T))
        .catch((err) => reject(err));
    });
  }

  public async CloseConnection(): Promise<void> {
    let connection: typeof mongoose;
    this.dbConnection
      .then((res) => {
        connection = res;

        return new Promise((resolve, reject) => {
          connection.connection
            .close()
            .then(() => resolve(undefined))
            .catch((err) => reject(err));
        });
      })
      .catch((err) => rejects(err));
  }

  public async Clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.model
        .deleteMany()
        .then(() => resolve(undefined))
        .catch((err) => reject(err));
    });
  }
}
