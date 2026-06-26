import { describe, expect, it } from "vitest";
import { donationSchema } from "./schema";

function pngFile(name = "ref.png") {
  return new File([new Uint8Array([1, 2, 3])], name, { type: "image/png" });
}

function baseInput() {
  return {
    name: "Ada Lovelace",
    reference: pngFile(),
  };
}

function fieldErrors(input: unknown) {
  const result = donationSchema.safeParse(input);
  if (result.success) return null;
  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("donationSchema — exchange rate rule", () => {
  it("requires exchangeRate when currency is BS", () => {
    const errors = fieldErrors({ ...baseInput(), currency: "BS" });
    expect(errors).toContain("exchangeRate");
  });

  it("accepts BS when exchangeRate is provided", () => {
    const result = donationSchema.safeParse({
      ...baseInput(),
      currency: "BS",
      exchangeRate: 36.5,
    });
    expect(result.success).toBe(true);
  });

  it("accepts USD without exchangeRate", () => {
    const result = donationSchema.safeParse({
      ...baseInput(),
      currency: "USD",
    });
    expect(result.success).toBe(true);
  });

  it("accepts USDT without exchangeRate", () => {
    const result = donationSchema.safeParse({
      ...baseInput(),
      currency: "USDT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-positive exchangeRate", () => {
    const errors = fieldErrors({
      ...baseInput(),
      currency: "BS",
      exchangeRate: 0,
    });
    expect(errors).toContain("exchangeRate");
  });
});

describe("donationSchema — required fields", () => {
  it("rejects an empty name", () => {
    const errors = fieldErrors({
      name: "",
      currency: "USD",
      reference: pngFile(),
    });
    expect(errors).toContain("name");
  });

  it("rejects a missing reference image", () => {
    const errors = fieldErrors({ name: "Ada", currency: "USD" });
    expect(errors).toContain("reference");
  });

  it("rejects an oversized reference image", () => {
    const big = new File([new Uint8Array(6 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });
    const errors = fieldErrors({ name: "Ada", currency: "USD", reference: big });
    expect(errors).toContain("reference");
  });
});
