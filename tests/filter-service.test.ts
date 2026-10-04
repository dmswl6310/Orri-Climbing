import { expect, it } from "vitest";
import { getGyms } from "@/services/gymService";

it("recognizes shower and limited parking facts from the existing catalogue", async () => {
  const showers = (await getGyms({ shower: "1" })).gyms.map(({ id }) => id);
  expect(showers).toEqual(expect.arrayContaining(["6", "16", "34"]));
  const parking = (await getGyms({ parking: "1" })).gyms.map(({ id }) => id);
  expect(parking).toContain("14");
});

it("does not return gyms lacking required facilities", async () => {
  const { gyms } = await getGyms({ parking: "1", shower: "1" });
  expect(gyms.some((gym) => gym.id === "2")).toBe(false);
});

it("returns no matches instead of substituting recommendations", async () => {
  const result = await getGyms({ q: "존재하지않는암장" });
  expect(result.gyms).toHaveLength(0);
  expect(result.recommendations).toHaveLength(6);
});
