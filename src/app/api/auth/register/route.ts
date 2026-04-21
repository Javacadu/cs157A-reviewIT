import { NextResponse } from "next/server";
import { register } from "@/lib/actions/authActions";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await register({
      username: body.username,
      email: body.email,
      password: body.password,
    });

    // Set session after successful registration
    if (result.success) {
      await setSession(result.data.userId, result.data.username);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}