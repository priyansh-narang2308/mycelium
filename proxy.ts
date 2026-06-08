import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 15;
const WINDOW_MS = 60000;

export function proxy(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  if (req.nextUrl.pathname.startsWith("/api/")) {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    let requestData = rateLimitMap.get(ip);

    if (!requestData || requestData.lastReset < windowStart) {
      requestData = { count: 0, lastReset: now };
    }

    requestData.count++;
    rateLimitMap.set(ip, requestData);

    if (requestData.count > LIMIT) {
      return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
