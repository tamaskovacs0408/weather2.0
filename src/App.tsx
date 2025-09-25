import "./App.scss";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CitySearch from "./components/CitySearch";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

function App() {
  const [geoData, setGeoData] = useState<GeoResponse | null>(null);
  function handleCitySelect(data: GeoResponse) {
    setGeoData(data);
  }
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <CitySearch onSelect={handleCitySelect} />
        <CurrentWeather data={geoData} defaultCity='Budapest' />
        <Forecast data={geoData} defaultCity='Budapest' />
        <ReactQueryDevtools initialIsOpen={false} />
      </main>
    </QueryClientProvider>
  );
}

export default App;
