import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    condition: { type: String, default: "Used - Good" },
    status: { type: String, default: "Active" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    meetupLocation: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;