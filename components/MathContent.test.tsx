import { render, screen } from "@testing-library/react";
import { MathContent } from "./MathContent";
import { expect, test } from "vitest";

test("renders math content", () => {
  render(<MathContent content="Test content with $x^2$" />);
  expect(screen.getByText(/Test content/)).toBeDefined();
});
