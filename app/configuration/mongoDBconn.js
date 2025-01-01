import mongoose from "mongoose";
const connectToMongoDB = (uri) =>
  mongoose.connect(uri, { connectTimeoutMS: 10000 });

export default connectToMongoDB;
