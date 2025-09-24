import { type ForecastDayProps } from "../type";
import "./ForecastData.scss"

function ForecastData({ precipitation, windSpeedMax}: ForecastDayProps) {
    return (
        <section className="forecast-data-wrapper">
            <div className="precipitation-container">
                <h3>Precipitation:</h3>
                <span>{precipitation} mm</span>
            </div>
            <div className="wind-container">
                <h3>Wind speed:</h3>
                <span>{windSpeedMax} km/h</span>
            </div>
        </section>
    )
}

export default ForecastData;