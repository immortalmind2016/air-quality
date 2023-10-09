import { connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import IORedis from 'ioredis-mock';

export default async function () {
  const redisClient = new IORedis();
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const mongoConnection = (await connect(uri)).connection;

  globalThis.__MONGOD__ = mongod;
  globalThis.__MONGOD_URI__ = uri;
  globalThis.__MONGOD_CONNECTION__ = mongoConnection;
  globalThis.__REDIS_CLIENT__ = redisClient;
}
