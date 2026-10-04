import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ComparisonProvider from "@/components/comparison/ComparisonProvider";
import CompareButton from "@/components/comparison/CompareButton";
import ShareComparison from "@/components/comparison/ShareComparison";

beforeEach(() => sessionStorage.clear());
describe("comparison controls", () => {
  it("prevents a fourth candidate and allows replacement after deselection", () => {
    const candidates = ["A", "B", "C", "D"].map((name) => ({ id: name, name }));
    render(<ComparisonProvider candidates={candidates}>{candidates.map((gym) => <CompareButton key={gym.id} {...gym} />)}</ComparisonProvider>);
    for (const name of ["A", "B", "C"]) fireEvent.click(screen.getByRole("button", { name: `${name} 비교 선택` }));
    expect(screen.getByRole("button", { name: "D 비교 선택" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "A 비교 해제" }));
    fireEvent.click(screen.getByRole("button", { name: "D 비교 선택" }));
    expect(screen.getByRole("button", { name: "D 비교 해제" })).toHaveAttribute("aria-pressed", "true");
  });
  it("offers a selectable URL if clipboard access fails", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    render(<ShareComparison href="/compare?ids=1%2C2" hasLocation />);
    expect(screen.getByText(/위치 좌표가 포함/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "비교 링크 복사" }));
    expect(await screen.findByRole("textbox", { name: "공유할 비교 링크" })).toHaveValue(`${window.location.origin}/compare?ids=1%2C2`);
  });
});
