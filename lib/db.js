import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOD_URL);
    console.log("Connectd Sucessfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
