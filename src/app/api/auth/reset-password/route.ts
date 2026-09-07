import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/db";
import User from "@/src/models/User";
import VerificationToken from "@/src/models/VerificationToken";
import { checkRateLimit } from "@/src/lib/rateLimit";
import { resetPasswordSchema } from "@/src/schemas/authSchema";

export async function POST(req: NextRequest) {
  try {
    const result = resetPasswordSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, otp, newPassword } = result.data;
    const limit = checkRateLimit(`password-reset-attempts:${email}`, 5, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${Math.ceil(limit.resetInSeconds / 60)} minutes.` },
        { status: 429 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    const token = await VerificationToken.findOne({
      userId: user._id,
      otp,
      purpose: "password-reset",
      expiresAt: { $gt: new Date() },
    });

    if (!token) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await token.deleteOne();

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Unable to reset your password right now." }, { status: 500 });
  }
}