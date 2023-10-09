export default async function () {
  await globalThis.__MONGOD_CONNECTION__.dropDatabase();
  await globalThis.__MONGOD_CONNECTION__.close();
  await globalThis.__MONGOD__.stop();
}
