import { type GeoResponse } from "../type";
import { useWeatherData } from "../hooks/useWeatherData";
import { formatDate } from "../utils/dateFormatHelper";
import "../styles/CurrentWeather.scss";

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

  return (
    <section className='current-weather-wrapper'>
      <div className='liquid-glass-filter'></div>
      <div className='liquid-glass-overlay'></div>
      <div className='liquid-glass-specluar'></div>
      <div className='current-weather-container'>
        <h2>{cityName}</h2>
        <div className='current-weather-data-container'>
          <span>{weatherData.current.temperature_2m}°C</span>
          <span>{weatherData.current.precipitation_probability} %</span>
          <span>{weatherData.current.precipitation} mm</span>
        </div>
      </div>
      <div className='hourly-weather-container'>
        {hourlyData.time.map((isoTime, i) => {
          return (
            <div key={isoTime} className='hourly-data'>
              <span>{formatDate(isoTime)}</span>
              <span>{hourlyData.temperature_2m[i]}°C</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CurrentWeather;
