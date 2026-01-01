import { NextRequest, NextResponse } from "next/server";
// Change this line to use '@' instead of dots
import { checkRateLimit } from "@/lib/rate-limiter"; 

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { info } = await checkRateLimit(req);
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}