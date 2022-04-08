import { Db, MongoClient } from "mongodb";
import { importData } from "./importData";
import { writeJSONSync } from "fs-extra";

let uri: string = process.env.MONGODB_URI || "";
let dbName: string = process.env.MONGODB_DB || "";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let runImportData = true;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

export async function connectToDatabase() {
  if (runImportData) {
    runImportData = false;
    await importData();
  }
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = await client.db(dbName);
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

module.exports = { connectToDatabase };
