import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/database";
import EscrowTrade from "@/models/EscrowTrade";
import Product from "@/models/Product";
import User from "@/models/User";

// POST /api/escrow - Create a new Escrow trade and lock funds
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

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== "Active") {
      return NextResponse.json(
        { success: false, error: "Product is no longer available." },
        { status: 400 }
      );
    }

    // Prevent buying your own product
    if (product.sellerId.toString() === session.user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot purchase your own listing." },
        { status: 400 }
      );
    }

    const buyer = await User.findById(session.user.id);
    if (!buyer || buyer.oneCardBalance < product.price) {
      return NextResponse.json(
        { success: false, error: "Insufficient OneCard balance." },
        { status: 400 }
      );
    }

    // Generate random 6-digit PIN
    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Lock funds on Buyer: deduct oneCardBalance, add to escrowInHold
    buyer.oneCardBalance -= product.price;
    buyer.escrowInHold += product.price;
    await buyer.save();

    // 2. Set Product to Pending
    product.status = "Pending";
    await product.save();

    // 3. Create EscrowTrade record
    const trade = await EscrowTrade.create({
      productId: product._id,
      buyerId: buyer._id,
      sellerId: product.sellerId,
      amount: product.price,
      verificationPin,
      status: "Escrow Locked",
    });

    return NextResponse.json(
      { success: true, tradeId: trade._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Escrow creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/escrow - Fetch single trade or all user trades
export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const tradeId = searchParams.get("tradeId");

    // Case 1: Specific trade lookup (used by /escrow and /verify screens)
    if (tradeId) {
      const trade = await EscrowTrade.findById(tradeId)
        .populate("productId", "title imageUrl")
        .populate("sellerId", "name email studentId")
        .populate("buyerId", "name email studentId");

      if (!trade) {
        return NextResponse.json(
          { success: false, error: "Escrow trade not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, trade });
    }

    // Case 2: Fetch all trades involving the authenticated user (for Dashboard)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const activePurchases = await EscrowTrade.find({
      buyerId: session.user.id,
      status: "Escrow Locked",
    })
      .populate("productId", "title imageUrl price")
      .populate("sellerId", "name studentId")
      .sort({ createdAt: -1 });

    const history = await EscrowTrade.find({
      $or: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
      status: { $in: ["Completed", "Cancelled"] },
    })
      .populate("productId", "title")
      .populate("sellerId", "name")
      .populate("buyerId", "name")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      purchases: activePurchases,
      history,
    });
  } catch (error) {
    console.error("Escrow GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}