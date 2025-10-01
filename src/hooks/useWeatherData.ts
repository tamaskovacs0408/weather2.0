import { useQuery } from "@tanstack/react-query";
import waitForRateLimit from "../utils/rateLimitHelper";
import {
  type Coordinates,
  type GeoResponse,
  type WeatherData,
} from "../type";

async function searchCities(query: string): Promise<GeoResponse[]> {
  if (query.length < 3) return [];

  await waitForRateLimit();

  const response = await fetch(
    `${import.meta.env.VITE_OPENSTREETMAP_URL}${encodeURIComponent(
      query
    )}&format=jsonv2&limit=4&addressdetails=1&accept-language=en`,
    {
      headers: {
        "User-Agent": import.meta.env.VITE_OPENSTREETMAP_USERAGENT,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search city");
  }

  const data: GeoResponse[] = await response.json();

  return data.filter(item => item.name);
}

async function fetchCoordinates(city: string): Promise<Coordinates> {
  await waitForRateLimit();

  const response = await fetch(
    `${import.meta.env.VITE_OPENSTREETMAP_URL}${encodeURIComponent(
      city
    )}&format=jsonv2&limit=1&addressdetails=1&accept-language=en`,
    {
      headers: {
        "User-Agent": import.meta.env.VITE_OPENSTREETMAP_USERAGENT,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coordinates");
  }

  const data: GeoResponse[] = await response.json();

  if (data.length === 0) {
    throw new Error("City not found");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    displayName: data[0].name,
  };
}

async function fetchWeather(coordinates: Coordinates): Promise<WeatherData> {
  const response = await fetch(
    `${import.meta.env.VITE_OPENMETEO_URL}/forecast?latitude=${
      coordinates.lat
    }&longitude=${
      coordinates.lon
    }&current=temperature_2m,precipitation,precipitation_probability&hourly=temperature_2m&forecast_hours=5&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,wind_speed_10m_max,sunrise,sunset&forecast_days=7&timezone=Europe/Budapest`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}

export const useSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["citySearch", searchTerm],
    queryFn: () => searchCities(searchTerm),
    enabled: searchTerm.length >= 3,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
};

export const useWeatherData = (city: string) => {
  const coordinatesQuery = useQuery({
    queryKey: ["coordinates", city],
    queryFn: () => fetchCoordinates(city),
    enabled: !!city && city.trim().length > 0,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1
  });

  const weatherQuery = useQuery({
    queryKey: [
      "weather",
      coordinatesQuery.data?.lat,
      coordinatesQuery.data?.lon,
    ],
    queryFn: () => fetchWeather(coordinatesQuery.data!),
    enabled: !!coordinatesQuery.data,
    staleTime: 1000 * 60 * 15,
  });

  return {
    coordinates: coordinatesQuery.data,
    weather: weatherQuery.data,
    isLoading: coordinatesQuery.isLoading || weatherQuery.isLoading,
    error: coordinatesQuery.error || weatherQuery.error,
    isSuccess: coordinatesQuery.isSuccess && weatherQuery.isSuccess,
  };
};
