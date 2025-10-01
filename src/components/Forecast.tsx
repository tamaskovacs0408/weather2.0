import Accordion from "./Accordion";
import ForecastData from "./ForecastData";
import { useWeatherData } from "../hooks/useWeatherData";
import { type GeoResponse } from "../type";

function Forecast({
  data,
  defaultCity = "Budapest",
}: {
  data: GeoResponse | null;
  defaultCity?: string;
}) {
  const cityName = data?.name || defaultCity;
  const { weather: weatherData, isLoading } = useWeatherData(cityName);

  if (isLoading) return <div className='loading-container'>Loading...</div>;
  if (!weatherData) return <div className='error-container'>No data for weather forecast...</div>;

  const dailyData = weatherData.daily;

  return (
    <section className='forecast-wrapper'>
      {dailyData.time.map((date, i) => (
        <Accordion
          key={date}
          date={date}
          tempMin={dailyData.temperature_2m_min[i]}
          tempMax={dailyData.temperature_2m_max[i]}
          className='accordion--compact'
        >
          <ForecastData
            precipitation={dailyData.precipitation_probability_mean[i]}
            windSpeedMax={dailyData.wind_speed_10m_max[i]}
            sunRise={dailyData.sunrise[i]}
            sunSet={dailyData.sunset[i]}
          />
        </Accordion>
      ))}
    </section>
  );
}

export default Forecast;
