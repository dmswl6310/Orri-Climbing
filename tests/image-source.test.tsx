import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import GymImage from "@/components/common/GymImage";

it.each(["broken-url", "javascript:alert(1)", "https://unconfigured.example/photo.jpg", "//unconfigured.example/photo.jpg"])("renders a fallback for an unsupported image source: %s", (src) => {
  render(<GymImage src={src} alt="암장" sizes="200px" />);
  expect(screen.getByText("이미지 준비 중")).toBeInTheDocument();
});
