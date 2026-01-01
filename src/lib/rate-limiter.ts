import { NextRequest } from "next/server";

const DAILY_LIMIT = 25;

interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
}

const COOKIE_NAME = "ms_usage";

function getTodayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

function getResetTime(): string {
  const reset = new Date();
  reset.setUTCDate(reset.getUTCDate() + 1);
  reset.setUTCHours(0, 0, 0, 0);
  return reset.toISOString();
}

// Parse cookie: "count:YYYY-MM-DD"
function parseUsage(cookie: string | undefined): number {
  if (!cookie) return 0;
  const [countStr, date] = cookie.split(":");
  if (date !== getTodayUTC()) return 0;
  return parseInt(countStr, 10) || 0;
}

export async function checkRateLimit(req: NextRequest): Promise<{ success: boolean; info: UsageInfo }> {
  const used = parseUsage(req.cookies.get(COOKIE_NAME)?.value);
  
  return {
    success: used < DAILY_LIMIT,
    info: {
      used,
      limit: DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - used),
      resetAt: getResetTime(),
    },
  };
}

export async function incrementUsage(req: NextRequest): Promise<{ info: UsageInfo; cookieValue: string }> {
  const used = parseUsage(req.cookies.get(COOKIE_NAME)?.value) + 1;
  
  return {
    info: {
      used,
      limit: DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - used),
      resetAt: getResetTime(),
    },
    cookieValue: `${used}:${getTodayUTC()}`,
  };
}

export const COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 86400,
};