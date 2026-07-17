import { MongoClient } from 'mongodb';

const dbName = process.env.DB_NAME || 'aanya_home_healthcare';

function getClientPromise() {
  if (!global._mongoClientPromise) {
    const uri = process.env.MONGO_URL;

    if (!uri) {
      throw new Error('MONGO_URL environment variable is not set');
    }

    const client = new MongoClient(uri, {
      maxPoolSize: 10,
    });

    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
