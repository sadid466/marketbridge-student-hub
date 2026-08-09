import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Validate DIU email
    if (!email || !email.endsWith("@diu.edu.bd")) {
      return NextResponse.json(
        { success: false, error: "Valid @diu.edu.bd email is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    // Don't reveal whether the email exists
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists, a reset link has been dispatched.",
        },
        { status: 200 }
      );
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry (30 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "MarketBridge Password Reset",
      html: `
        <h2>Reset Your Password</h2>

        <p>Hello ${user.name},</p>

        <p>You requested to reset your MarketBridge password.</p>

        <p>
          <a href="${resetUrl}"
             style="
                background:#2563eb;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;">
            Reset Password
          </a>
        </p>

        <p>Or copy this link into your browser:</p>

        <p>${resetUrl}</p>

        <p>This link expires in <strong>30 minutes</strong>.</p>

        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "If an account exists, a reset link has been dispatched.",
      },
      { status: 200 }
    );
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