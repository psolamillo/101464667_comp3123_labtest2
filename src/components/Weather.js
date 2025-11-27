import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OPEN_WEATHER_API_KEY } from '../weatherConfig';

const getIconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

export default function Weather() {
  const { city: urlCity } = useParams();
  const [searchCity, setSearchCity] = useState(urlCity || 'Toronto');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = (city) => {
    setLoading(true);
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found or API key invalid');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        const date = new Date();
        setWeather({
          city: data.name,
          country: data.sys.country,
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          temp: Math.round(data.main.temp),
          tempMax: Math.round(data.main.temp_max),
          tempMin: Math.round(data.main.temp_min),
          condition: data.weather[0].main,
          iconCode: data.weather[0].icon,
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6),
          pressure: data.main.pressure
        });
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(urlCity || 'Toronto');
  }, [urlCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Weather <span>Forecast</span></h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="message">Loading...</p>}
      {error && <p className="message error">{error}</p>}

      {weather && !loading && (
        <div className="weather-card">
          <div className="card-left">
            <h2>{weather.day}</h2>
            <p className="date">{weather.date}</p>
            <p className="location">📍 {weather.city}, {weather.country}</p>
            <img src={getIconUrl(weather.iconCode)} alt={weather.condition} />
            <div className="temp">{weather.temp}°C</div>
            <div className="condition">{weather.condition}</div>
          </div>
          
          <div className="card-right">
            <div className="detail-row">
              <span>HUMIDITY</span>
              <span>{weather.humidity} %</span>
            </div>
            <div className="detail-row">
              <span>WIND</span>
              <span>{weather.wind} km/h</span>
            </div>
            <div className="detail-row">
              <span>AIR PRESSURE</span>
              <span>{weather.pressure} mb</span>
            </div>
            <div className="detail-row">
              <span>MAX TEMP</span>
              <span>{weather.tempMax} °C</span>
            </div>
            <div className="detail-row">
              <span>MIN TEMP</span>
              <span>{weather.tempMin} °C</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}