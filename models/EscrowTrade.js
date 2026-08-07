import mongoose from "mongoose";

const EscrowTradeSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    verificationPin: { type: String, required: true }, // 6-digit random PIN
    status: {
      type: String,
      enum: ["Escrow Locked", "Completed", "Cancelled"],
      default: "Escrow Locked",
    },
  },
  { timestamps: true }
);

export default mongoose.models.EscrowTrade || mongoose.model("EscrowTrade", EscrowTradeSchema);