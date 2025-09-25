import { type GeoResponse } from "../type";
import { useWeatherData } from "../hooks/useWeatherData";

function CurrentWeather({
  data,
  defaultCity = "Budapest",
}: {
  data: GeoResponse | null;
  defaultCity?: string;
}) {
  const cityName = data?.name || defaultCity;
  const { weather: weatherData, isLoading } = useWeatherData(cityName);

  if (isLoading) return <div className='loading-container'>Loading...</div>;
  if (!weatherData) return <div className='error-container'>No data</div>;

  const hourlyData = weatherData.hourly;

  const formatDate = (fullDate: string): string => {
    const date = new Date(fullDate);
    return date.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className='current-weather-wrapper'>
      <div className='current-weather-container'>
        <h2>{cityName}</h2>
        <p>{weatherData.current.temperature_2m} °C</p>
        <p>{weatherData.current.precipitation_probability} %</p>
        <p>{weatherData.current.precipitation} mm</p>
      </div>
      <div className='hourly-weather-container'>
        {hourlyData.time.map((isoTime, i) => {
          return (
            <div key={isoTime} className='hourly-data'>
              <span>{formatDate(isoTime)}</span>
              <span>{hourlyData.temperature_2m[i]}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CurrentWeather;
