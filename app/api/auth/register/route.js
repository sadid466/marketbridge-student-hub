import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, studentId, password } = await req.json();

    if (!studentId || !email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if account exists
    const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email or Student ID already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with studentId & password
    await User.create({
      name,
      email,
      studentId,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}