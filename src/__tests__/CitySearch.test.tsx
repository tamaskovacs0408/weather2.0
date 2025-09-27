import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import CitySearch from "../components/CitySearch";
import { renderWithQueryClient } from "../test/test-utils";
import type { GeoResponse } from "../type";
import { useSearch } from "../hooks/useWeatherData";
import type { UseQueryResult } from "@tanstack/react-query";

vi.mock("../hooks/useWeatherData", () => ({
  useSearch: vi.fn(),
}));

const mockUseSearch = vi.mocked(useSearch);

const suggestion: GeoResponse = {
  lat: "47.4979",
  lon: "19.0402",
  name: "Budapest",
  display_name: "Budapest, Hungary",
};

function createQueryResult(
  data: GeoResponse[],
  overrides: Partial<UseQueryResult<GeoResponse[], Error>> = {}
): UseQueryResult<GeoResponse[], Error> {
  const base: Partial<UseQueryResult<GeoResponse[], Error>> = {
    data,
    error: null,
    fetchStatus: "idle",
    isError: false,
    isFetching: false,
    isLoading: false,
    isLoadingError: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isSuccess: true,
    status: "success",
    refetch: vi.fn(),
  };

  return {
    ...base,
    ...overrides,
  } as UseQueryResult<GeoResponse[], Error>;
}

describe("CitySearch component", () => {
  beforeEach(() => {
    mockUseSearch.mockImplementation((term: string) => {
      if (term.length >= 3) {
        return createQueryResult([suggestion]);
      }

      return createQueryResult([], {
        isSuccess: false,
        status: "pending",
        isPending: true,
        isFetched: false,
        isFetchedAfterMount: false,
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows autocomplete suggestions and triggers selection", async () => {
    vi.useFakeTimers();

    const onSelect = vi.fn();

    renderWithQueryClient(<CitySearch onSelect={onSelect} />);

    const input = screen.getByPlaceholderText(
      "Search for a place..."
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: "Bud" } });
      await vi.advanceTimersByTimeAsync(1200);
    });

    vi.useRealTimers();

    const suggestionItem = await screen.findByText("Budapest, Hungary");
    fireEvent.click(suggestionItem);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Budapest",
        display_name: "Budapest, Hungary",
      })
    );

    expect(input.value).toBe("Budapest");
  });
});
