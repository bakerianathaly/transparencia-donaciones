import { describe, expect, it } from "vitest";
import { purchaseSchema } from "./schema";

const PNG_DATA_URL = "data:image/png;base64,AAAA";

function baseInput() {
  return {
    storeName: "Supermercado Central",
    amount: 50,
    image: PNG_DATA_URL,
  };
}

function fieldErrors(input: unknown) {
  const result = purchaseSchema.safeParse(input);
  if (result.success) return null;
  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("purchaseSchema — required fields", () => {
  it("rejects an empty store name", () => {
    const errors = fieldErrors({ ...baseInput(), storeName: "", currency: "USD" });
    expect(errors).toContain("storeName");
  });

  it("rejects a missing amount", () => {
    const errors = fieldErrors({
      storeName: "Local",
      currency: "USD",
      image: PNG_DATA_URL,
    });
    expect(errors).toContain("amount");
  });

  it("rejects a non-positive amount", () => {
    const errors = fieldErrors({ ...baseInput(), currency: "USD", amount: 0 });
    expect(errors).toContain("amount");
  });

  it("rejects an invalid currency", () => {
    const errors = fieldErrors({ ...baseInput(), currency: "GBP" });
    expect(errors).toContain("currency");
  });

  it("rejects a missing image", () => {
    const errors = fieldErrors({ storeName: "Local", amount: 10, currency: "USD" });
    expect(errors).toContain("image");
  });

  it("rejects an empty image", () => {
    const errors = fieldErrors({ ...baseInput(), currency: "USD", image: "" });
    expect(errors).toContain("image");
  });

  it("rejects an image that is not a base64 data URL", () => {
    const errors = fieldErrors({
      ...baseInput(),
      currency: "USD",
      image: "https://example.com/recibo.png",
    });
    expect(errors).toContain("image");
  });

  it("rejects an oversized image", () => {
    const huge = `data:image/png;base64,${"A".repeat(7 * 1024 * 1024)}`;
    const errors = fieldErrors({ ...baseInput(), currency: "USD", image: huge });
    expect(errors).toContain("image");
  });
});

describe("purchaseSchema — accepts valid input", () => {
  it.each(["USD", "EUR", "USDT", "BS"] as const)("accepts %s", (currency) => {
    const result = purchaseSchema.safeParse({ ...baseInput(), currency });
    expect(result.success).toBe(true);
  });
});
