import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Keep the browsing flow deterministic even when the external photo service is unavailable.
  await page.route("**/_next/image?**", (route) => route.abort());
});

test("popular results, keyword search, detail and browser back", async ({ page }) => {
  await page.goto("/search");
  await expect(page.getByRole("heading", { name: "전체 암장" })).toBeVisible();
  await expect(page.getByRole("region", { name: "검색 결과", exact: true }).getByRole("link").first()).toHaveAttribute("href", "/gyms/21");
  await page.getByRole("combobox").fill("게이트원");
  await page.getByRole("combobox").press("Enter");
  await expect(page.getByRole("heading", { name: "“게이트원” 검색 결과" })).toBeVisible();
  await page.getByRole("region", { name: "검색 결과", exact: true }).getByRole("link").first().click();
  await expect(page.getByRole("heading", { name: "게이트원 클라이밍", exact: true })).toBeVisible();
  await expect(page.getByText(/요금 정보가 아직 등록되지 않았습니다/)).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("combobox")).toHaveValue("게이트원");
  await expect(page.getByRole("heading", { name: "“게이트원” 검색 결과" })).toBeVisible();
});

test("autocomplete selects a gym and missing images have a fallback", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox").fill("강남");
  await page.getByRole("combobox").press("ArrowDown");
  await expect(page.getByRole("option").first()).toHaveAttribute("aria-selected", "true");
  await page.getByRole("combobox").press("Enter");
  await expect(page).toHaveURL(/\/gyms\/1$/);
  await page.goto("/search?q=존재하지않는암장");
  await expect(page.getByRole("heading", { name: "검색 결과가 없어요" })).toBeVisible();
  await expect(page.getByText("이미지 준비 중").first()).toBeVisible();
});

test("invalid coordinates and repeated keywords are handled without an error page", async ({ page }) => {
  await page.goto("/search?q=강남&q=서초&lat=91&lon=127&sort=distance");
  await expect(page.getByRole("heading", { name: "전체 암장" })).toBeVisible();
  await expect(page.getByText(/위치 정보가 올바르지 않아/)).toBeVisible();
  await expect(page.getByRole("button", { name: "기본순" })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/gyms/missing");
  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없어요" })).toBeVisible();
});

test("denied location permission leaves keyword search usable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition: (_success: PositionCallback, failure: PositionErrorCallback) =>
        failure({ code: 1 } as GeolocationPositionError),
    } });
  });
  await page.goto("/search");
  await page.getByRole("button", { name: "내 위치로 검색", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("권한");
  await page.getByRole("combobox").fill("게이트원");
  await page.getByRole("combobox").press("Enter");
  await expect(page.getByRole("heading", { name: "“게이트원” 검색 결과" })).toBeVisible();
});

test("a late GPS response cannot overwrite a newer sort", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition: (success: PositionCallback) => {
        window.addEventListener("resolve-test-location", () => success({
          coords: { latitude: 37.4979, longitude: 127.0276 },
        } as GeolocationPosition), { once: true });
      },
    } });
  });
  await page.goto("/search?q=강남");
  await page.getByRole("button", { name: "내 위치로 검색", exact: true }).click();
  await page.getByRole("button", { name: "기본순" }).click();
  await expect(page).toHaveURL(/sort=popular/);
  await page.evaluate(() => window.dispatchEvent(new Event("resolve-test-location")));
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/sort=popular/);
  await page.getByRole("combobox").fill("게이트원");
  await page.getByRole("combobox").press("Enter");
  await expect(page.getByRole("heading", { name: "“게이트원” 검색 결과" })).toBeVisible();
  await expect(page).not.toHaveURL(/lat=/);
});

test("mobile layout stays within the viewport and header does not overlap navigation", async ({ page }) => {
  await page.goto("/search?q=강남");
  const geometry = await page.evaluate(() => ({
    viewport: window.innerWidth,
    width: document.documentElement.scrollWidth,
    navBottom: document.querySelector("nav")!.getBoundingClientRect().bottom,
    inputTop: document.querySelector('input[role="combobox"]')!.getBoundingClientRect().top,
  }));
  expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
  expect(geometry.inputTop).toBeGreaterThan(geometry.navBottom);
});
