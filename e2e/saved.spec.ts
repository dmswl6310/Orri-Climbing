import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.route("**/_next/image?**", (route) => route.abort());
});

test("save, reload, compare and synchronize removal across tabs", async ({ page, context }) => {
  await page.goto("/search?q=데모");
  await page.getByRole("button", { name: "오르리 데모 강남 기기 저장 하기" }).click();
  await page.getByRole("button", { name: "오르리 데모 성수 기기 저장 하기" }).click();
  await page.getByRole("link", { name: "기기 저장", exact: true }).click();
  const saved = page.getByRole("region", { name: "이 기기에 저장한 암장", exact: true });
  await expect(saved.getByRole("article")).toHaveCount(2);
  await expect(saved.getByRole("heading").first()).toHaveText("오르리 데모 성수");
  await page.reload();
  await expect(saved.getByRole("article")).toHaveCount(2);
  await page.getByRole("button", { name: "오르리 데모 강남 비교 선택" }).click();
  await page.getByRole("button", { name: "오르리 데모 성수 비교 선택" }).click();
  const other = await context.newPage();
  await other.goto("/saved");
  await expect(other.getByRole("region", { name: "이 기기에 저장한 암장", exact: true }).getByRole("article")).toHaveCount(2);
  await other.getByRole("button", { name: "오르리 데모 강남 기기 저장 해제" }).click();
  await expect(saved.getByRole("article")).toHaveCount(1);
  // Removing a device save must not remove an independently selected comparison candidate.
  await page.getByRole("link", { name: "2개 암장 비교하기" }).click();
  await expect(page.getByRole("table").getByRole("columnheader")).toHaveCount(3);
  await other.getByRole("button", { name: "오르리 데모 성수 기기 저장 해제" }).click();
  await expect(other.getByRole("heading", { name: "아직 저장한 암장이 없어요" })).toBeVisible();
  await other.close();
});

test("detail saves persist after the tab is closed and legacy routes remain useful", async ({ page, context }) => {
  await page.goto("/gyms/demo-1");
  await page.getByRole("button", { name: "오르리 데모 강남 기기 저장 하기" }).click();
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto("/settings");
  await expect(reopened).toHaveURL(/\/saved$/);
  await expect(reopened.getByRole("button", { name: "오르리 데모 강남 기기 저장 해제" })).toHaveAttribute("aria-pressed", "true");
  await reopened.goto("/login");
  await expect(reopened).toHaveURL(/\/search$/);
  await expect(reopened.getByRole("navigation", { name: "주 메뉴" }).getByRole("link", { name: /로그인|회원가입/ })).toHaveCount(0);
  await reopened.close();
});

test("blocked device storage reports failure without breaking search", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new Error("blocked"); } });
  });
  await page.goto("/search?q=데모");
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "오르리 데모 강남", exact: true }) });
  await card.getByRole("button", { name: "오르리 데모 강남 기기 저장 하기" }).click();
  await expect(card.getByRole("alert")).toContainText("저장하지 못했습니다");
  await expect(card.getByRole("button", { name: "오르리 데모 강남 기기 저장 하기" })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("link", { name: "기기 저장", exact: true }).click();
  await expect(page.getByRole("heading", { name: "저장 목록을 확인할 수 없어요" })).toBeVisible();
});

test("demo presentation and saved page fit a narrow mobile viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/search?q=데모");
  await expect(page.getByText(/누적 저장|★/)).toHaveCount(0);
  await page.getByRole("button", { name: "오르리 데모 강남 기기 저장 하기" }).click();
  await page.getByRole("link", { name: "기기 저장", exact: true }).click();
  const geometry = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
  await expect(page.getByRole("heading", { name: "이 기기에 저장한 암장", exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("device-saved.png"), fullPage: true });
});
