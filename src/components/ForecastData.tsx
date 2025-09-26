import { formatDate } from "../utils/dateFormatHelper";
import { type ForecastDayProps } from "../type";
import "../styles/ForecastData.scss";

function ForecastData({
  precipitation,
  windSpeedMax,
  sunRise,
  sunSet,
}: ForecastDayProps) {
  return (
    <section className='forecast-data-wrapper'>
      <div className='precipitation-container'>
        <h3>Precipitation:</h3>
        <span>{precipitation} mm</span>
      </div>
      <div className='wind-container'>
        <h3>Wind speed:</h3>
        <span>{windSpeedMax} km/h</span>
      </div>
      <div className='sunrise-container'>
        <h3>Sunrise</h3>
        <span>{formatDate(sunRise)}</span>
      </div>
      <div className='sunset-container'>
        <h3>Sunset</h3>
        <span>{formatDate(sunSet)}</span>
      </div>
    </section>
  );
}

export default ForecastData;
