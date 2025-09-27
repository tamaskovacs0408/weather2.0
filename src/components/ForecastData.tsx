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
        <img src="/rain.svg" alt="raindrops icon" />
        <span>{precipitation} mm</span>
      </div>
      <div className='wind-container'>
        <img src="/wind.svg" alt="wind icon" />
        <span>{windSpeedMax} km/h</span>
      </div>
      <div className='sunrise-container'>
        <img src="/sunrise.svg" alt="sunrise icon" />
        <span>{formatDate(sunRise)}</span>
      </div>
      <div className='sunset-container'>
        <img src="/sunset.svg" alt="sunset icon" />
        <span>{formatDate(sunSet)}</span>
      </div>
    </section>
  );
}

export default ForecastData;
