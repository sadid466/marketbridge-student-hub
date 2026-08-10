import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    condition: { type: String, default: "Used - Good" },
    status: { type: String, default: "Active" },

    // The Cloudinary URL used consistently by the upload route, API, and UI.
    imageUrl: { type: String, default: null, trim: true },
    phone: String,

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    meetupLocation: { type: String },
  },
  { timestamps: true },
);

// Next.js keeps Mongoose models between hot reloads. If the server first loaded
// the old Product schema (which had no imageUrl), Mongoose would silently drop
// imageUrl on create. Replace only that stale development model.
if (
  mongoose.models.Product &&
  !mongoose.models.Product.schema.path("imageUrl")
) {
  mongoose.deleteModel("Product");
}

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
