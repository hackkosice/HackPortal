/* eslint-disable @typescript-eslint/no-empty-function */
import "@testing-library/jest-dom/extend-expect";
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
