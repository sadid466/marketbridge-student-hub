import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/database";
import EscrowTrade from "@/models/EscrowTrade";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { tradeId, pin } = await req.json();

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Verification PIN is required." },
        { status: 400 }
      );
    }

    // Find trade by ID or directly by verificationPin
    let trade;
    if (tradeId) {
      trade = await EscrowTrade.findById(tradeId);
    } else {
      trade = await EscrowTrade.findOne({ 
        verificationPin: pin.trim(),
        sellerId: session.user.id,
        status: "Escrow Locked"
      });
    }

    if (!trade) {
      return NextResponse.json(
        { success: false, error: "Escrow transaction not found." },
        { status: 404 }
      );
    }

    if (trade.status !== "Escrow Locked") {
      return NextResponse.json(
        { success: false, error: `Transaction is already ${trade.status}.` },
        { status: 400 }
      );
    }

    // Verify PIN match
    if (trade.verificationPin !== pin.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid Verification PIN." },
        { status: 400 }
      );
    }

    // 1. Deduct buyer's escrow hold & credit seller's balance
    await User.findByIdAndUpdate(trade.buyerId, {
      $inc: { escrowInHold: -trade.amount },
    });

    await User.findByIdAndUpdate(trade.sellerId, {
      $inc: { oneCardBalance: trade.amount },
    });

    // 2. Update Trade and Product status
    trade.status = "Completed";
    await trade.save();

    await Product.findByIdAndUpdate(trade.productId, {
      status: "Sold",
    });

    return NextResponse.json({
      success: true,
      message: "Handover verified and funds released to seller!",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}