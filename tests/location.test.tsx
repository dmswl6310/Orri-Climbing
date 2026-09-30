import { act, fireEvent, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { getAddressFromCoords } from "@/services/kakaoService";

const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("reverse geocoding", () => {
  it("does not call Kakao for invalid coordinates", async () => {
    vi.stubEnv("KAKAO_REST_API_KEY", "test-key");
    const fetcher = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetcher);
    expect(await getAddressFromCoords("91", "127")).toBe("");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("works without an API key and avoids an unauthorized request", async () => {
    vi.stubEnv("KAKAO_REST_API_KEY", "");
    const fetcher = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetcher);
    expect(await getAddressFromCoords("37", "127")).toBe("");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("ignores malformed region data", async () => {
    vi.stubEnv("KAKAO_REST_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ documents: [{}] }) }));
    expect(await getAddressFromCoords("37", "127")).toBe("");
  });

  it("prefers the administrative address", async () => {
    vi.stubEnv("KAKAO_REST_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ documents: [
      { region_type: "B", region_2depth_name: "강남구", region_3depth_name: "역삼동" },
      { region_type: "H", region_2depth_name: "강남구", region_3depth_name: "역삼1동" },
    ] }) }));
    expect(await getAddressFromCoords("37", "127")).toBe("강남구 역삼1동");
  });
});

describe("location search", () => {
  it("invalidates pending success and error callbacks when an internal link is clicked", () => {
    let resolve!: PositionCallback;
    let reject!: PositionErrorCallback;
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: (success: PositionCallback, failure: PositionErrorCallback) => { resolve = success; reject = failure; } } });
    const { result } = renderHook(() => useLocationSearch());
    act(() => result.current.handleLocationSearch());
    const link = document.createElement("a");
    link.href = "/search";
    // Avoid jsdom trying to navigate; application listens before this handler.
    link.addEventListener("click", (event) => event.preventDefault());
    document.body.appendChild(link);
    fireEvent.click(link);
    act(() => {
      resolve({ coords: { latitude: 37, longitude: 127 } } as GeolocationPosition);
      reject({ code: 1 } as GeolocationPositionError);
    });
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("");
    link.remove();
  });

  it("ignores a GPS response after the query changes", () => {
    let resolve!: PositionCallback;
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: (success: PositionCallback) => { resolve = success; } } });
    const { result, rerender } = renderHook(({ query }) => useLocationSearch(query), { initialProps: { query: "강남" } });
    act(() => result.current.handleLocationSearch());
    rerender({ query: "서초" });
    act(() => resolve({ coords: { latitude: 37, longitude: 127 } } as GeolocationPosition));
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("only navigates for the latest GPS control across hooks", () => {
    const callbacks: PositionCallback[] = [];
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: (success: PositionCallback) => { callbacks.push(success); } } });
    const first = renderHook(() => useLocationSearch("강남"));
    const second = renderHook(() => useLocationSearch("서초"));
    act(() => first.result.current.handleLocationSearch());
    act(() => second.result.current.handleLocationSearch());
    act(() => callbacks[0]({ coords: { latitude: 37, longitude: 127 } } as GeolocationPosition));
    expect(push).not.toHaveBeenCalled();
    expect(first.result.current.isLoading).toBe(false);
    act(() => callbacks[1]({ coords: { latitude: 38, longitude: 128 } } as GeolocationPosition));
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent("서초")));
  });

  it("ignores duplicate requests and resets its label after navigation", async () => {
    let resolve!: PositionCallback;
    const getCurrentPosition = vi.fn((success: PositionCallback) => { resolve = success; });
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });
    const { result } = renderHook(() => useLocationSearch());
    act(() => {
      result.current.handleLocationSearch();
      result.current.handleLocationSearch();
    });
    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    act(() => resolve({ coords: { latitude: 37, longitude: 127 } } as GeolocationPosition));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.userLocation).toBe("내 위치로 검색");
    expect(push).toHaveBeenCalledWith(expect.stringContaining("lat=37"));
  });

  it("reports permission denial inline and allows retry", async () => {
    vi.stubGlobal("alert", vi.fn());
    const getCurrentPosition = vi.fn((_success: PositionCallback, failure: PositionErrorCallback) => failure({ code: 1 } as GeolocationPositionError));
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });
    const { result } = renderHook(() => useLocationSearch());
    act(() => result.current.handleLocationSearch());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toHaveProperty("error", expect.stringContaining("권한"));
    expect(alert).not.toHaveBeenCalled();
    act(() => result.current.handleLocationSearch());
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
  });
});
