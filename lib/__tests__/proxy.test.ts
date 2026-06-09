import { middleware as proxy } from "@/proxy";
import { NextRequest } from "next/server";

interface MockedResponse {
  status: number;
  body: string | null;
  headers: {
    get(name: string): string | null;
    set(name: string, value: string): void;
  };
}

class MockNextRequest {
  nextUrl: { pathname: string };
  headers: {
    get(name: string): string | null;
  };

  constructor(pathname: string, headers: Record<string, string> = {}) {
    this.nextUrl = { pathname };
    const lowerHeaders = new Map<string, string>();
    for (const [k, v] of Object.entries(headers)) {
      lowerHeaders.set(k.toLowerCase(), v);
    }
    this.headers = {
      get: (name: string) => lowerHeaders.get(name.toLowerCase()) || null,
    };
  }
}

jest.mock("next/server", () => {
  class MockHeaders {
    private map = new Map<string, string>();
    constructor(init?: Record<string, string>) {
      if (init) {
        for (const [k, v] of Object.entries(init)) {
          this.map.set(k.toLowerCase(), v);
        }
      }
    }
    get(name: string) {
      return this.map.get(name.toLowerCase()) || null;
    }
    set(name: string, value: string) {
      this.map.set(name.toLowerCase(), value);
    }
  }

  class MockResponse {
    status: number;
    body: string | null;
    headers: MockHeaders;

    constructor(body: string | null = null, init?: { status?: number; headers?: Record<string, string> }) {
      this.status = init?.status ?? 200;
      this.body = body;
      this.headers = new MockHeaders(init?.headers);
    }

    static next() {
      return new MockResponse();
    }
  }

  return {
    NextResponse: MockResponse,
  };
});

describe("Next.js 16 Edge Proxy (Rate Limiter)", () => {
  let originalDateNow: typeof Date.now;
  let mockTime = 1000000;

  beforeAll(() => {
    originalDateNow = Date.now;
    global.Date.now = () => mockTime;
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
  });

  beforeEach(() => {
    mockTime = 1000000;
  });

  it("passes through non-API requests", () => {
    const req = new MockNextRequest("/dashboard") as unknown as NextRequest;
    const res = proxy(req) as unknown as MockedResponse;

    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Remaining")).toBeNull();
  });

  it("applies rate limiting for API requests and sets header", () => {
    const req = new MockNextRequest("/api/recommend") as unknown as NextRequest;
    
    // Request 1
    let res = proxy(req) as unknown as MockedResponse;
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("29");

    // Request 2
    res = proxy(req) as unknown as MockedResponse;
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("28");
  });

  it("respects x-forwarded-for client IP separating limits", () => {
    const req1 = new MockNextRequest("/api/recommend", { "x-forwarded-for": "1.2.3.4" }) as unknown as NextRequest;
    const req2 = new MockNextRequest("/api/recommend", { "x-forwarded-for": "5.6.7.8" }) as unknown as NextRequest;

    const res1 = proxy(req1) as unknown as MockedResponse;
    expect(res1.headers.get("X-RateLimit-Remaining")).toBe("29");

    const res2 = proxy(req2) as unknown as MockedResponse;
    expect(res2.headers.get("X-RateLimit-Remaining")).toBe("29");
  });

  it("triggers 429 after limit exceeded", () => {
    const req = new MockNextRequest("/api/recommend", { "x-forwarded-for": "9.9.9.9" }) as unknown as NextRequest;

    // Send 30 allowed requests
    for (let i = 0; i < 30; i++) {
      const res = proxy(req) as unknown as MockedResponse;
      expect(res.status).toBe(200);
    }

    // 31st request triggers 429
    const res = proxy(req) as unknown as MockedResponse;
    expect(res.status).toBe(429);
    expect(JSON.parse(res.body || "{}")).toEqual({ error: "Too Many Requests" });
  });

  it("resets rate limit counter after window passes", () => {
    const req = new MockNextRequest("/api/recommend", { "x-forwarded-for": "8.8.8.8" }) as unknown as NextRequest;

    // First request
    let res = proxy(req) as unknown as MockedResponse;
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("29");

    // Advance mock time past 60,000ms window
    mockTime += 61000;

    // Next request should reset and start fresh
    res = proxy(req) as unknown as MockedResponse;
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("29");
  });
});
