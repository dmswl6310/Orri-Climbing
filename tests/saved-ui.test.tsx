import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import SavedProvider from "@/components/saved/SavedProvider";
import SaveButton from "@/components/saved/SaveButton";

beforeEach(() => localStorage.clear());
it("saves from one view and reflects the same saved state in another", () => {
  render(<SavedProvider ids={["1"]}><SaveButton id="1" name="암장 A" /><SaveButton id="1" name="다른 화면" /></SavedProvider>);
  fireEvent.click(screen.getByRole("button", { name: "암장 A 기기 저장 하기" }));
  expect(screen.getByRole("button", { name: "다른 화면 기기 저장 해제" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "다른 화면 기기 저장 해제" }));
  expect(screen.getByRole("button", { name: "암장 A 기기 저장 하기" })).toHaveAttribute("aria-pressed", "false");
});
it("shows a write failure beside the clicked control without marking it saved", () => {
  render(<SavedProvider ids={["1"]}><SaveButton id="1" name="암장 A" /></SavedProvider>);
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
  fireEvent.click(screen.getByRole("button", { name: "암장 A 기기 저장 하기" }));
  expect(screen.getByRole("alert")).toHaveTextContent("저장하지 못했습니다");
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  write.mockRestore();
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
