import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchInputBox from "@/components/search/SearchInputBox";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";

const navigation = vi.hoisted(() => ({ push: vi.fn(), query: "" }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
  useSearchParams: () => new URLSearchParams(navigation.query),
}));

const pool = [
  { id: "1", name: "강남 암장", district: "강남구", address: "서울 강남" },
  { id: "2", name: "강남 볼더", district: "강남구", address: "서울 강남" },
];
function renderInput(query = "") {
  return render(<SearchInputBox gymSearchPool={pool} query={query} isFloat={false} isLoading={false} onLocationSearch={() => {}} />);
}
beforeEach(() => { navigation.query = ""; });

describe("autocomplete", () => {
  it("selects a suggestion with the pointer without losing the click to blur", async () => {
    const user = userEvent.setup();
    renderInput();
    await user.type(screen.getByPlaceholderText("지역 또는 암장 이름 검색"), "강남");
    await user.click(screen.getByText("강남 암장"));
    expect(navigation.push).toHaveBeenCalledWith("/gyms/1");
  });

  it("resets its input and highlight after URL navigation", async () => {
    const user = userEvent.setup();
    const view = renderInput("강남");
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}");
    view.rerender(<SearchInputBox gymSearchPool={pool} query="서초" isFloat={false} isLoading={false} onLocationSearch={() => {}} />);
    expect(screen.getByRole("combobox")).toHaveValue("서초");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
  it("selects a suggestion using the keyboard", async () => {
    const user = userEvent.setup();
    renderInput();
    await user.type(screen.getByPlaceholderText("지역 또는 암장 이름 검색"), "강남");
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(navigation.push).toHaveBeenCalledWith("/gyms/2");
  });

  it("closes suggestions on Escape without navigating", async () => {
    const user = userEvent.setup();
    renderInput();
    const input = screen.getByPlaceholderText("지역 또는 암장 이름 검색");
    await user.type(input, "강남");
    await user.keyboard("{Escape}");
    expect(screen.queryByText("강남 암장")).not.toBeInTheDocument();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("does not submit Enter during Korean composition", () => {
    renderInput("강남");
    fireEvent.keyDown(screen.getByPlaceholderText("지역 또는 암장 이름 검색"), { key: "Enter", isComposing: true, keyCode: 229 });
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("submits a trimmed keyword", async () => {
    const user = userEvent.setup();
    renderInput("  강남  ");
    await user.click(screen.getByRole("button", { name: "검색하기" }));
    expect(navigation.push).toHaveBeenCalledWith(`/search?q=${encodeURIComponent("강남")}`);
  });

  it("closes the dropdown when keyboard focus leaves the input", async () => {
    const user = userEvent.setup();
    renderInput();
    await user.type(screen.getByPlaceholderText("지역 또는 암장 이름 검색"), "강남");
    await user.tab();
    expect(screen.queryByText("강남 암장")).not.toBeInTheDocument();
  });
});

it("labels an unfiltered search as all gyms", () => {
  render(<SearchResultsHeader address="" totalCount={50} />);
  expect(screen.getByRole("heading", { name: "전체 암장" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /최신순/ })).not.toBeInTheDocument();
});
