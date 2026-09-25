import { MongoClient, ServerApiVersion } from "mongodb";

const URI = process.env.ATLAS_URI;

if (!URI) {
  throw new Error("ATLAS_URI environment variable is not configured");
}

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  appName: "employee-records-app",
});

try {
  await client.connect();

  await client.db("admin").command({ ping: 1 });

  console.log("MongoDB connection established successfully.");
} catch (error) {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
}

const db = client.db("employees");

export default db;