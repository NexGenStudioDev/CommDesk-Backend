import { describe, test, expect } from "@jest/globals";

export const square = (x: number) => {
  return x * x;
};

export const factorial = (n: number): number => {
  if (n < 0) {
    throw new Error("Negative numbers are not allowed");
  }
  if (n === 0) return 1;
  return n * factorial(n - 1);
};

describe("Math Utility Functions", () => {
  describe("square()", () => {
    test("should calculate square correctly", () => {
      expect(square(2)).toBe(4);
      expect(square(-3)).toBe(9);
      expect(square(0)).toBe(0);
    });
  });

  describe("factorial()", () => {
    test("should calculate factorial correctly", () => {
      expect(factorial(5)).toBe(120);
      expect(factorial(0)).toBe(1);
    });

    test("should throw error for negative numbers", () => {
      expect(() => factorial(-1)).toThrow("Negative numbers are not allowed");
    });
  });
});

export const reverseString = (str: string): string =>
  str.split("").reverse().join("");

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

describe("String Utility Functions", () => {
  describe("reverseString()", () => {
    test("should reverse string correctly", () => {
      expect(reverseString("hello")).toBe("olleh");
      expect(reverseString("TypeScript")).toBe("tpircSepyT");
      expect(reverseString("")).toBe("");
    });
  });

  describe("capitalizeFirstLetter()", () => {
    test("should capitalize first letter", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("typeScript")).toBe("TypeScript");
    });

    test("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });
});
