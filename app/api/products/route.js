import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please log in before creating a listing." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const title = body.title?.trim();
    const category = body.category?.trim();
    const price = Number(body.price);

    if (!title || !category || !Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { success: false, error: "Title, category, and a valid price are required." },
        { status: 400 },
      );
    }

    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : null;

    const newProduct = await Product.create({
      title,
      description: body.description?.trim() || "",
      category,
      condition: body.condition?.trim() || "Used",
      price,
      phone: body.phone?.trim() || "",
      imageUrl: imageUrl || null,
      sellerId: session.user.id,
    });

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
