import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";
import User from "@/models/User";
import { SAMPLE_PRODUCTS } from "@/data/products";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Create or retrieve a default mock seller user
    let defaultSeller = await User.findOne({ email: "seller@diu.edu.bd" });
    if (!defaultSeller) {
      defaultSeller = await User.create({
        name: "Mohammed Omar",
        email: "seller@diu.edu.bd",
        department: "Computer Science & Engineering",
        oneCardBalance: 3000,
        escrowInHold: 0,
      });
    }

    // 2. Clear existing products to prevent duplicates during testing
    await Product.deleteMany({});

    // 3. Format and seed sample products attached to the mock seller ID
    const formattedProducts = SAMPLE_PRODUCTS.map((item) => ({
      title: item.title,
      description: item.description || "In great condition. Ready for campus pickup.",
      price: item.price,
      category: item.category,
      condition: item.condition || "Used - Good",
      status: "Active",
      sellerId: defaultSeller._id,
      meetupLocation: item.meetupLocation || "DIU Knowledge Valley",
    }));

    const seededProducts = await Product.insertMany(formattedProducts);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully seeded ${seededProducts.length} products into MongoDB!`,
        seller: defaultSeller,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}