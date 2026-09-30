import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/_next/image?**", (route) => route.abort());
});

test("budget and facility filters persist in URL, back navigation and reset", async ({ page }) => {
  await page.goto("/search?q=데모");
  await page.getByRole("textbox", { name: "일일 이용권 최대 가격" }).fill("15000");
  await page.getByRole("checkbox", { name: "주차", exact: true }).check();
  await page.getByRole("checkbox", { name: "초보자 체험 강습" }).check();
  await page.getByRole("button", { name: "조건 적용", exact: true }).click();
  await expect(page).toHaveURL(/maxPrice=15000&parking=1&beginner=1/);
  const results = page.getByRole("region", { name: "검색 결과", exact: true });
  await expect(results.getByRole("article")).toHaveCount(1);
  await expect(results.getByRole("heading", { name: "오르리 데모 강남" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("textbox", { name: "일일 이용권 최대 가격" })).toHaveValue("15000");
  await page.getByRole("link", { name: "필터 초기화", exact: true }).click();
  await expect(page).toHaveURL(/\/search\?q=/);
  await expect(results.getByRole("article")).toHaveCount(3);
  await page.goBack();
  await expect(page.getByRole("checkbox", { name: "주차", exact: true })).toBeChecked();
  await expect(results.getByRole("article")).toHaveCount(1);
});

test("invalid budget is recoverable and zero matches stay separate from recommendations", async ({ page }) => {
  await page.goto("/search?q=데모");
  const budget = page.getByRole("textbox", { name: "일일 이용권 최대 가격" });
  await budget.fill("-1");
  await page.getByRole("button", { name: "조건 적용", exact: true }).click();
  await expect(budget).toBeFocused();
  await expect(page.getByRole("region", { name: "방문 조건 필터" }).getByRole("alert")).toContainText("정수");
  await budget.fill("0");
  await page.getByRole("button", { name: "조건 적용", exact: true }).click();
  await expect(page.getByRole("heading", { name: "검색 결과가 없어요" })).toBeVisible();
  await expect(page.getByText("총 0개의 암장", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "추천 암장" }).getByRole("article")).toHaveCount(6);
  await page.getByRole("button", { name: "일일권 0원 이하 조건 해제" }).click();
  await expect(page.getByRole("region", { name: "검색 결과", exact: true }).getByRole("article")).toHaveCount(3);
});

test("GPS and popularity sorting retain active filters", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition: (success: PositionCallback) => success({ coords: { latitude: 37.49, longitude: 127.03 } } as GeolocationPosition),
    } });
  });
  await page.goto("/search?q=데모&maxPrice=15000&parking=1");
  await page.getByRole("button", { name: "📍 거리순" }).click();
  await expect(page).toHaveURL(/maxPrice=15000&parking=1&lat=37.49&lon=127.03&sort=distance/);
  await page.getByRole("button", { name: "🔥 인기순" }).click();
  await expect(page).toHaveURL(/maxPrice=15000&parking=1&lat=37.49&lon=127.03&sort=popular/);
  await expect(page.getByRole("region", { name: "검색 결과", exact: true }).getByRole("article")).toHaveCount(1);
});

test("select, refresh, compare, share URL and mobile table overflow", async ({ page }, testInfo) => {
  await page.goto("/search?q=데모");
  for (const name of ["강남", "성수", "홍대"]) await page.getByRole("button", { name: `오르리 데모 ${name} 비교 선택`, exact: true }).click();
  await page.reload();
  await expect(page.getByRole("complementary", { name: "비교 후보" })).toContainText("비교 후보 3/3");
  await page.screenshot({ path: testInfo.outputPath("selection.png"), fullPage: true });
  await page.getByRole("link", { name: "3개 암장 비교하기" }).click();
  await expect(page).toHaveURL(/\/compare\?ids=demo-1%2Cdemo-2%2Cdemo-3/);
  const table = page.getByRole("table");
  await expect(table.getByRole("columnheader")).toHaveCount(4);
  await expect(table.getByRole("row", { name: /일일권 최저가/ })).toContainText("12,000원");
  await expect(table.getByRole("row", { name: /암벽화 대여/ })).toContainText("정보 없음");
  await expect(table.getByRole("row", { name: /주차/ })).toContainText("불가");
  const geometry = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
  expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
  await page.getByRole("region", { name: "암장 비교표" }).focus();
  await expect(page.getByRole("region", { name: "암장 비교표" })).toBeFocused();
  if (testInfo.project.name === "mobile") {
    const scroller = page.getByRole("region", { name: "암장 비교표" });
    await scroller.press("ArrowRight");
    await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await scroller.evaluate((element) => { element.scrollLeft = 0; });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("comparison.png"), fullPage: true });
  const shared = page.url();
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(shared);
  await expect(table.getByRole("columnheader")).toHaveCount(4);
  await page.getByRole("link", { name: "오르리 데모 성수 비교표에서 제거" }).click();
  await expect(table.getByRole("columnheader")).toHaveCount(3);
  await page.goBack();
  await expect(table.getByRole("columnheader")).toHaveCount(4);
});

test("limit selection to three and clear stored candidates", async ({ page }) => {
  await page.goto("/search");
  const buttons = page.getByRole("region", { name: "검색 결과", exact: true }).getByRole("button", { name: /비교 선택$/ });
  // Selecting a candidate changes its accessible name, so the next unselected button stays first.
  for (let index = 0; index < 3; index++) await buttons.first().click();
  await expect(buttons.first()).toBeDisabled();
  await page.getByRole("button", { name: "모두 비우기" }).click();
  await expect(buttons.first()).toBeEnabled();
  await page.reload();
  await expect(page.getByRole("complementary", { name: "비교 후보" })).toHaveCount(0);
});

test("malformed and undersized shared comparisons recover without crashing", async ({ page }) => {
  await page.goto("/compare?ids=missing,demo-1,demo-2,demo-3&lat=91&lon=127");
  await expect(page.getByText(/일부 비교 대상이 올바르지/)).toBeVisible();
  await expect(page.getByText(/위치 정보가 올바르지 않아/)).toBeVisible();
  await expect(page.getByRole("table").getByRole("columnheader")).toHaveCount(3);
  await page.goto("/compare?ids=demo-1&ids=demo-2");
  await expect(page.getByText("비교하려면 암장이 2개 이상 필요해요.")).toBeVisible();
  await expect(page.getByRole("link", { name: "암장 고르러 가기" })).toBeVisible();
});

test("reset clears unapplied filters even when already on the base search URL", async ({ page }) => {
  await page.goto("/search");
  const budget = page.getByRole("textbox", { name: "일일 이용권 최대 가격" });
  await budget.fill("-1");
  await page.getByRole("checkbox", { name: "주차", exact: true }).check();
  await page.getByRole("button", { name: "조건 적용", exact: true }).click();
  await page.getByRole("link", { name: "필터 초기화", exact: true }).click();
  await expect(budget).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: "주차", exact: true })).not.toBeChecked();
  await expect(page.getByRole("region", { name: "방문 조건 필터" }).getByRole("alert")).toHaveCount(0);
});
