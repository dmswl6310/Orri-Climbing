import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import SearchFilter from "@/components/search/SearchFilter";
import SearchInputBox from "@/components/search/SearchInputBox";
import SearchChoices from "@/components/search/SearchChoices";

const nav = vi.hoisted(() => ({ push: vi.fn(), query: "q=강남&parking=1&maxPrice=20000&lat=37&lon=127" }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: nav.push }),
  useSearchParams: () => new URLSearchParams(nav.query),
}));
beforeEach(() => { nav.query = "q=강남&parking=1&maxPrice=20000&lat=37&lon=127"; });

it.each(["필터 초기화", "전체 초기화"])("clears unsaved drafts and errors even when %s targets the current URL", async (label) => {
  nav.query = "";
  render(<SearchChoices />);
  await userEvent.type(screen.getByLabelText("일일 이용권 최대 가격"), "-1");
  await userEvent.click(screen.getByRole("checkbox", { name: "주차" }));
  await userEvent.click(screen.getByRole("button", { name: "조건 적용" }));
  const reset = screen.getByRole("link", { name: label });
  reset.addEventListener("click", (event) => event.preventDefault());
  await userEvent.click(reset);
  expect(screen.getByLabelText("일일 이용권 최대 가격")).toHaveValue("");
  expect(screen.getByRole("checkbox", { name: "주차" })).not.toBeChecked();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("applies all draft conditions and resets only filters", async () => {
  render(<SearchChoices />);
  expect(screen.getByRole("checkbox", { name: "주차" })).toBeChecked();
  await userEvent.click(screen.getByRole("checkbox", { name: "샤워실" }));
  await userEvent.click(screen.getByRole("button", { name: "조건 적용" }));
  const params = new URL(nav.push.mock.calls[0][0], "https://example.test").searchParams;
  expect(params.get("parking")).toBe("1");
  expect(params.get("shower")).toBe("1");
  const reset = new URL(screen.getByRole("link", { name: "필터 초기화" }).getAttribute("href")!, "https://example.test").searchParams;
  expect(reset.get("q")).toBe("강남");
  expect(reset.get("lat")).toBe("37");
  expect(reset.has("maxPrice")).toBe(false);
  expect(reset.has("parking")).toBe(false);
});

it("keeps invalid budgets on screen with an error instead of silently applying", async () => {
  render(<SearchChoices />);
  const input = screen.getByLabelText("일일 이용권 최대 가격");
  await userEvent.clear(input);
  await userEvent.type(input, "-100");
  await userEvent.click(screen.getByRole("button", { name: "조건 적용" }));
  expect(screen.getByRole("alert")).toHaveTextContent("정수");
  expect(input).toHaveFocus();
  expect(nav.push).not.toHaveBeenCalled();
});

it("retains the budget and facilities when sorting", async () => {
  render(<SearchFilter />);
  await userEvent.click(screen.getByRole("button", { name: "🔥 인기순" }));
  const params = new URL(nav.push.mock.calls[0][0], "https://example.test").searchParams;
  expect(params.get("parking")).toBe("1");
  expect(params.get("maxPrice")).toBe("20000");
  expect(params.get("sort")).toBe("popular");
});

it("keeps filters and coordinates when submitting another keyword", async () => {
  render(<SearchInputBox gymSearchPool={[]} query="강남" isFloat isLoading={false} onLocationSearch={() => {}}
    searchContext={{ parking: "1", maxPrice: "20000", lat: "37", lon: "127" }} />);
  const input = screen.getByRole("combobox");
  await userEvent.clear(input);
  await userEvent.type(input, "서초{Enter}");
  const params = new URL(nav.push.mock.calls[0][0], "https://example.test").searchParams;
  expect(params.get("q")).toBe("서초");
  expect(params.get("parking")).toBe("1");
  expect(params.get("lat")).toBe("37");
});
