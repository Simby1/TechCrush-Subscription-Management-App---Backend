import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI
const connectToMongoDB = async () => {
    try {
        if (!uri) {
            throw new Error("MONGODB_URI environment variable is not defined.")
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
      } catch (err) {
        console.error("Error connecting to MongoDB:", err);
      }
}

export default connectToMongoDB;