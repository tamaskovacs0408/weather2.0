import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { waitFor, renderHook } from "@testing-library/react";
import { useSearch, useWeatherData } from "../hooks/useWeatherData";
import { renderHookWithQueryClient } from "../test/test-utils";
import type { GeoResponse, WeatherData } from "../type";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

vi.mock("../utils/rateLimitHelper", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

const originalFetch = globalThis.fetch;

describe("useWeatherData hooks", () => {
  let fetchMock: ReturnType<
    typeof vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >
  >;

  beforeAll(() => {
    vi.stubEnv("VITE_OPENSTREETMAP_URL", "https://openstreetmap.test?q=");
    vi.stubEnv("VITE_OPENSTREETMAP_USERAGENT", "weather-test-agent");
    vi.stubEnv("VITE_OPENMETEO_URL", "https://openmeteo.test");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    fetchMock =
      vi.fn<
        (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
      >();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("does not call fetch when search term is shorter than 3 characters", () => {
    const { result } = renderHookWithQueryClient(() => useSearch("ab"));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("searches cities and filters out results without a name", async () => {
    const apiResponse: GeoResponse[] = [
      {
        lat: "47.4979",
        lon: "19.0402",
        name: "Budapest",
        display_name: "Budapest, Hungary",
      },
      { lat: "48", lon: "20", name: "", display_name: "Unnamed" },
    ];

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(apiResponse), { status: 200 })
    );

    const { result } = renderHookWithQueryClient(() => useSearch("Bud"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      "https://openstreetmap.test?q=Bud&format=jsonv2&limit=4&addressdetails=1&accept-language=en",
      {
        headers: {
          "User-Agent": "weather-test-agent",
        },
      }
    );

    expect(result.current.data).toEqual([
      {
        lat: "47.4979",
        lon: "19.0402",
        name: "Budapest",
        display_name: "Budapest, Hungary",
      },
    ]);
  });

  it("fetches coordinates and weather data for a selected city", async () => {
    const coordinatesResponse: GeoResponse[] = [
      {
        lat: "47.4979",
        lon: "19.0402",
        name: "Budapest",
        display_name: "Budapest",
      },
    ];

    const weatherResponse: WeatherData = {
      current: {
        temperature_2m: 12,
        precipitation: 0,
        precipitation_probability: 10,
      },
      hourly: {
        time: ["2024-01-01T10:00"],
        temperature_2m: [12],
      },
      daily: {
        time: ["2024-01-01"],
        temperature_2m_max: [15],
        temperature_2m_min: [5],
        precipitation_probability_mean: [1],
        wind_speed_10m_max: [15],
        sunrise: ["2024-01-01T07:00"],
        sunset: ["2024-01-01T16:00"],
      },
    };

    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify(coordinatesResponse), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(weatherResponse), { status: 200 })
      );

    const { result } = renderHookWithQueryClient(() =>
      useWeatherData("Budapest")
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://openstreetmap.test?q=Budapest&format=jsonv2&limit=1&addressdetails=1&accept-language=en",
      {
        headers: {
          "User-Agent": "weather-test-agent",
        },
      }
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://openmeteo.test/forecast?latitude=47.4979&longitude=19.0402&current=temperature_2m,precipitation,precipitation_probability&hourly=temperature_2m&forecast_hours=5&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,wind_speed_10m_max,sunrise,sunset&forecast_days=7&timezone=Europe/Budapest"
    );

    expect(result.current.coordinates).toEqual({
      lat: "47.4979",
      lon: "19.0402",
      displayName: "Budapest",
    });

    expect(result.current.weather).toEqual(weatherResponse);
  });

  it("propagates API errors from the coordinates request", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
          refetchOnWindowFocus: false,
        },
      },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useWeatherData("Budapest"), {
      wrapper,
    });

    await waitFor(
      () => {
        expect(result.current.error).not.toBeNull();
      },
      { timeout: 3000 }
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Failed to fetch coordinates"
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);

    queryClient.clear();
  });
});
