import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";
import EscrowTrade from "@/models/EscrowTrade";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    await connectToDatabase();

    // Query items by seller if sellerId is provided, otherwise return all items
    const query = sellerId ? { sellerId } : {};
    const items = await Product.find(query).sort({ createdAt: -1 }).lean();

    // If fetching for a specific seller, find active escrow trades to attach tradeId
    if (sellerId && items.length > 0) {
      const activeTrades = await EscrowTrade.find({
        sellerId,
        status: "Escrow Locked",
      }).lean();

      // Create a lookup map: productId -> tradeId
      const tradeMap = {};
      activeTrades.forEach((trade) => {
        tradeMap[trade.productId.toString()] = trade._id.toString();
      });

      // Attach activeTradeId to each item
      const enrichedItems = items.map((item) => ({
        ...item,
        activeTradeId: tradeMap[item._id.toString()] || null,
      }));

      return NextResponse.json({ success: true, items: enrichedItems }, { status: 200 });
    }

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}