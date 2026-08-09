import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const item = await Product.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}