import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { vi, afterEach } from "vitest";

// Clean up after each test
afterEach(() => {
  cleanup();
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});
