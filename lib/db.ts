import { Db, MongoClient, ServerApiVersion } from "mongodb";

let cachedClient: Promise<MongoClient>;
let cachedDb: Db;

const URL = process.env.MONGO_DB;
const DB_NAME = process.env.DB_NAME;

export function connect() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!URL) {
    throw new Error("No MongoDB URL found.");
  }

  if (!DB_NAME) {
    throw new Error("No DB NAME found.");
  }

  const client = new MongoClient(URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  const db = client.db(DB_NAME);

  cachedClient = client.connect();
  cachedDb = db;

  return cachedClient;
}

export function db() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!URL) {
    throw new Error("No MongoDB URL found.");
  }

  if (!DB_NAME) {
    throw new Error("No DB NAME found.");
  }

  const client = new MongoClient(URL);
  const db = client.db(DB_NAME);

  cachedClient = client.connect();
  cachedDb = db;

  return cachedDb;
}
