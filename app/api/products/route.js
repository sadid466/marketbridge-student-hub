import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";
import User from "@/models/User";

// GET /api/products - Fetch all active products
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({ status: "Active" })
      .populate("sellerId", "name email department")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Post a new product listing
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newProduct = await Product.create(body);

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}