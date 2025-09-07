import { type ReactNode } from "react";

export interface AccordionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  defaultOpen?: boolean;
};

export interface Coordinates {
  lat: string;
  lon: string;
  displayName?: string;
}

export interface GeoResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export interface CurrentWeather {
  temperature_2m: number;
  precipitation: number;
  precipitation_probability?: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
}

export interface CurrentWeatherProps {
  current: CurrentWeather;
  hourly: HourlyWeather;
}

export interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

export interface CitySearchProps {
  onSelect: (place: string) => void;
  placeholder?: string;
}