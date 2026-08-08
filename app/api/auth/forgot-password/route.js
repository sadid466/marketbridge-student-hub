import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.endsWith("@diu.edu.bd")) {
      return NextResponse.json(
        { success: false, error: "Valid @diu.edu.bd email is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    return NextResponse.json(
      {
        success: true,
        message: "If an account exists, a reset link has been dispatched.",
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