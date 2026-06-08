/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

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

expect.extend(toHaveNoViolations);
