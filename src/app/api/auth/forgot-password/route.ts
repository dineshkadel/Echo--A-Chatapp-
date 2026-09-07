import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import User from "@/src/models/User";
import VerificationToken from "@/src/models/VerificationToken";
import { generateOtp } from "@/src/lib/generateOtp";
import { sendPasswordResetEmail } from "@/src/lib/email/verifyEmail";
import { checkRateLimit } from "@/src/lib/rateLimit";
import { requestPasswordResetSchema } from "@/src/schemas/authSchema";

const RESET_WINDOW_MS = 2 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const result = requestPasswordResetSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email } = result.data;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const limit = checkRateLimit(`password-reset:${ip}:${email}`, 3, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: `Too many reset requests. Try again in ${Math.ceil(limit.resetInSeconds / 60)} minutes.` },
        { status: 429 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (user) {
      await VerificationToken.deleteMany({ userId: user._id, purpose: "password-reset" });
      const otp = generateOtp();
      await VerificationToken.create({
        userId: user._id,
        otp,
        purpose: "password-reset",
        expiresAt: new Date(Date.now() + RESET_WINDOW_MS),
      });
      await sendPasswordResetEmail(user.email, user.username, otp);
    }

    return NextResponse.json({ message: "If an account exists for that email, a reset code has been sent." });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ error: "Unable to send a reset code right now." }, { status: 500 });
  }
}