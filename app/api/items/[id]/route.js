import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";

// GET single product
export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // Next.js 15+/App Router: `params` is a Promise and must be awaited.
    const { id } = await params;

    const item = await Product.findById(id).populate(
      "sellerId",
      "name email"
    );

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    // Next.js 15+/App Router: `params` is a Promise and must be awaited.
    // Reading `params.id` directly returned undefined, so findByIdAndDelete
    // matched nothing and always responded "Item not found".
    const { id } = await params;

    const deletedItem = await Product.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}