import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.NODE_ENV === "production" ? "prod" : "dev";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoUriWithDb = `${MONGO_URI}/${DB_NAME}`;
    cached.promise = mongoose
      .connect(mongoUriWithDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log(
          `Connected to MongoDB database: ${DB_NAME} in ${process.env.NODE_ENV} mode`
        );
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
