// Single-connection MongoDB helper using native driver
const { MongoClient } = require("mongodb");
let _clientPromise;
let _db;

async function getDb() {
  if (_db) return _db;

  console.log("Connecting to MongoDB...", process.env.APPSETTING_MONGODB_URI);

  // Reuse a single client across hot reloads in dev (optional)
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 20,
      retryWrites: true,
    });
    global._mongoClientPromise = client.connect();
  }

  _clientPromise = global._mongoClientPromise;
  const client = await _clientPromise;
  _db = client.db(process.env.MONGODB_DB);

  // Ensure indexes once on startup
  await _db.collection("messages").createIndexes([
    { key: { room_id: 1, inserted_at: 1 } },
  ]);

  return _db;
}

module.exports = { getDb };
