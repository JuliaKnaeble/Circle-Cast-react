import React, { useState, useEffect } from "react";
import axios from "axios";
import City from "./City";
import Current from "./Current";
import ForecastPreview from "./ForecastPreview";
import "./Header.css";

const Header = (props) => {
  const [city, setCity] = useState(props.defaultCity);
  const [weather, setWeather] = useState({});
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState({});
  const [forecast, setForecast] = useState({});
  const [fahrenheit, setFahrenheit] = useState(false);
  const [fSelected, setFSelected] = useState({});
  const [cSelected, setCSelected] = useState(props.unitC);
  const [ready, setReady] = useState(false);

  function showTime(response) {
    setDay(response.data.day_of_week);
    let date = new Date();
    let hours = date.getUTCHours();
    let inte = parseInt(hours);
    let offset = parseInt(response.data.utc_offset);
    let totalHour = inte + offset;
    if (totalHour >= 24) {
      return totalHour - 24;
    } else if (totalHour < 0) {
      totalHour += 24;
    } else if (totalHour === 0) {
      totalHour = `00`;
    } else if (totalHour < 10) {
      totalHour = `0${totalHour}`;
    } else totalHour = inte + offset;
    setHour({
      ready: true,
      hourSet: totalHour,
    });
    setReady(true);
  }

  function showForecast(response) {
    setForecast(response.data);

    let timeUrl = `https://worldtimeapi.org/api/timezone/`;
    axios.get(`${timeUrl}${response.data.timezone}`).then(showTime);
  }

  function showWeather(response) {
    setWeather({
      ready: true,
      city: response.data.name,
      description: response.data.weather[0].description,
      temp: response.data.main.temp,
      icon: response.data.weather[0].icon,
      humid: response.data.main.humidity,
      wind: response.data.wind.speed,
      latitude: response.data.coord.lat,
      longitude: response.data.coord.lon,
    });

    let latitude = response.data.coord.lat;
    let longitude = response.data.coord.lon;
    let apiKeyWeather = `a785b12636ed229463fa77e0a6deb5be`;
    let weatherForecastUrl = `https://api.openweathermap.org/data/2.5/onecall`;
    axios
      .get(
        `${weatherForecastUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKeyWeather}&units=metric`
      )
      .then(showForecast);
  }

  function search() {
    let apiKey = `a785b12636ed229463fa77e0a6deb5be`;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(url).then(showWeather);
    setCity("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  function handleChange(event) {
    setCity(event.target.value);
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayFahrenheit(event) {
    event.preventDefault();
    setFahrenheit(true);
    setFSelected({
      color: `#fcfeff`,
      backgroundColor: `#465866`,
      borderRadius: `50%`,
      cursor: `default`,
    });
    setCSelected({});
  }

  function displayCelcius(event) {
    event.preventDefault();
    setFahrenheit(false);
    setCSelected({
      color: `#fcfeff`,
      backgroundColor: `#465866`,
      borderRadius: `50%`,
      cursor: `default`,
    });
    setFSelected({});
  }

  if (ready) {
    return (
      <div>
        <div className="Header">
          <div className="page-name">
            <a href="index.html">
              <strong>Circle</strong>Cast
            </a>
          </div>
          <div className="search-form">
            <form onSubmit={handleSubmit}>
              <button>
                <i className="fas fa-search search-icon" />
              </button>
              <input
                className="text-input"
                type="text"
                placeholder="Search for a city"
                autoComplete="off"
                spellCheck="false"
                autoFocus
                onChange={handleChange}
                value={city}
              />
            </form>
          </div>
          <div>
            <a href="http://">
              <span
                className="conversion-c"
                onClick={displayCelcius}
                style={cSelected}
              >
                C
              </span>
              <span
                className="conversion-f"
                onClick={displayFahrenheit}
                style={fSelected}
              >
                F
              </span>
            </a>
          </div>
        </div>
        <City
          city={weather.city}
          description={weather.description}
          dayOfWeek={day}
          fullHour={hour.hourSet}
        />
        <Current
          temperature={weather.temp}
          humidity={weather.humid}
          wind={weather.wind}
          icon={weather.icon}
          unit={fahrenheit}
        />
        <div className="forecast-flax-wrapper forecast-scroll">
          <ForecastPreview
            max={forecast.daily[0].temp.max}
            min={forecast.daily[0].temp.min}
            icon={forecast.daily[0].weather[0].icon}
            day={day}
            unit={fahrenheit}
          />
          <ForecastPreview
            max={forecast.daily[1].temp.max}
            min={forecast.daily[1].temp.min}
            icon={forecast.daily[1].weather[0].icon}
            day={day + 1}
            unit={fahrenheit}
          />
          <ForecastPreview
            max={forecast.daily[2].temp.max}
            min={forecast.daily[2].temp.min}
            icon={forecast.daily[2].weather[0].icon}
            day={day + 2}
            unit={fahrenheit}
          />
          <ForecastPreview
            max={forecast.daily[3].temp.max}
            min={forecast.daily[3].temp.min}
            icon={forecast.daily[3].weather[0].icon}
            day={day + 3}
            unit={fahrenheit}
          />
          <ForecastPreview
            max={forecast.daily[4].temp.max}
            min={forecast.daily[4].temp.min}
            icon={forecast.daily[4].weather[0].icon}
            day={day + 4}
            unit={fahrenheit}
          />
          <ForecastPreview
            max={forecast.daily[5].temp.max}
            min={forecast.daily[5].temp.min}
            icon={forecast.daily[5].weather[0].icon}
            day={day + 5}
            unit={fahrenheit}
          />
          <ForecastPreview
            max={forecast.daily[6].temp.max}
            min={forecast.daily[6].temp.min}
            icon={forecast.daily[6].weather[0].icon}
            day={day + 6}
            unit={fahrenheit}
          />
        </div>
      </div>
    );
  } else {
    return "Loading....";
  }
};

export default Header;
