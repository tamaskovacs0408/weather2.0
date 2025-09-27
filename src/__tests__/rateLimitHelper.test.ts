import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

async function importWaiter() {
  const module = await import("../utils/rateLimitHelper");
  return module.default;
}

describe("waitForRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(60_000);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it("resolves immediately the first time", async () => {
    const waitForRateLimit = await importWaiter();

    const start = Date.now();
    await waitForRateLimit();

    expect(Date.now() - start).toBe(0);
  });

  it("waits for the remaining interval when called too quickly", async () => {
    const waitForRateLimit = await importWaiter();

    await waitForRateLimit();
    vi.advanceTimersByTime(500);

    const waitPromise = waitForRateLimit();

    await vi.advanceTimersByTimeAsync(600);
    await waitPromise;

    expect(Date.now()).toBe(60_000 + 1_100);
  });
});
