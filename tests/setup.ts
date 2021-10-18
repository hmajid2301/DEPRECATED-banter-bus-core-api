import { MongoMemoryServer } from 'mongodb-memory-server';
import 'reflect-metadata';

let mongod: MongoMemoryServer;

export default async function setup() {
  mongod = new MongoMemoryServer({
    instance: {
      port: 5133,
      dbName: 'banterbus',
      storageEngine: 'wiredTiger',
    },
    auth: {},
    binary: {
      version: '4.4.4',
    },
  });
  await mongod.start();
  (global as any).__MONGOD__ = mongod;
}
