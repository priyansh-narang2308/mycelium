/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST as parseRoute } from "../../app/api/parse/route";
import { POST as recommendRoute } from "../../app/api/recommend/route";
import { POST as insightRoute } from "../../app/api/insight/route";

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({ text: "{}" }),
    },
  })),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: any) => {
      return {
        status: init?.status || 200,
        json: async () => body,
      };
    },
  },
}));

if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(input: any, init?: any) {}
  } as any;
}
if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body?: any, init?: any) {}
  } as any;
}

function createMockRequest(body: any, headers: Record<string, string> = {}) {
  return {
    json: async () => body,
    headers: {
      get: (key: string) => headers[key] || null,
    },
  } as unknown as Request;
}

describe("API Routes", () => {
  describe("POST /api/parse", () => {
    it("returns 400 when input is missing", async () => {
      const req = createMockRequest({});
      const res = await parseRoute(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it("returns 200 and handles mock AI response via graceful degradation on error (since AI key is missing in tests)", async () => {
      const req = createMockRequest({ input: "I drove 10km" });
      const res = await parseRoute(req);
      // In a pure unit test without a mock, the Gemini call will fail and return {} which is a 200 response from orchestrator fallback
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toBeDefined();
    });
  });

  describe("POST /api/recommend", () => {
    it("returns 400 when history is invalid", async () => {
      const req = createMockRequest({ history: "not an array" });
      const res = await recommendRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 200 on empty history", async () => {
      const req = createMockRequest({ history: [] });
      const res = await recommendRoute(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.recommendations).toEqual([]);
    });
  });

  describe("POST /api/insight", () => {
    it("returns 400 when budget is missing", async () => {
      const req = createMockRequest({ history: [] });
      const res = await insightRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 200 and a fallback insight when history is provided", async () => {
      const req = createMockRequest({ history: [], budget: 10 });
      const res = await insightRoute(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.insight).toBeDefined();
    });
  });
});
