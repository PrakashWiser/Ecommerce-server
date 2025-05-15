import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    listingType: {
      type: String,
      required: true,
      enum: ["skateboard", "bike", "shoe", "other"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
