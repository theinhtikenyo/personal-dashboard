import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '../types';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Yangon coordinates: latitude 16.8661, longitude 96.1951
        const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast?latitude=16.87&longitude=96.20&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FRangoon'
        );
        
        // Get weather description based on WMO weather code
        const weatherDescription = getWeatherDescription(response.data.current.weather_code);
        const weatherIcon = getWeatherIcon(response.data.current.weather_code);
        
        // Transform the response to match our WeatherData interface
        const weatherData: WeatherData = {
          main: {
            temp: response.data.current.temperature_2m,
            humidity: response.data.current.relative_humidity_2m,
            feels_like: response.data.current.apparent_temperature
          },
          weather: [
            {
              description: weatherDescription,
              icon: weatherIcon
            }
          ],
          name: 'Yangon',
          sys: {
            country: 'Myanmar'
          },
          wind: {
            speed: response.data.current.wind_speed_10m
          }
        };
        
        setWeather(weatherData);
        setLoading(false);
      } catch (err) {
        console.error('Weather API error:', err);
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to convert WMO weather codes to descriptions
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown';
  };

  // Function to get weather icon URL based on WMO code
  const getWeatherIcon = (code: number): string => {
    // Map WMO codes to appropriate Unsplash images
    if (code === 0) {
      return 'https://images.unsplash.com/photo-1599155253646-e2b7d8f49b1a?w=100&h=100&fit=crop&q=80'; // Clear sky
    } else if (code >= 1 && code <= 3) {
      return 'https://images.unsplash.com/photo-1525490829609-d166ddb58678?w=100&h=100&fit=crop&q=80'; // Partly cloudy
    } else if (code >= 45 && code <= 48) {
      return 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=100&h=100&fit=crop&q=80'; // Fog
    } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=100&h=100&fit=crop&q=80'; // Rain
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?w=100&h=100&fit=crop&q=80'; // Snow
    } else if (code >= 95 && code <= 99) {
      return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=100&h=100&fit=crop&q=80'; // Thunderstorm
    } else {
      return 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=100&h=100&fit=crop&q=80'; // Default weather
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-full">
        <div className="animate-pulse text-gray-500">Loading weather data...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500 flex items-center justify-center">
          <Cloud className="h-5 w-5 mr-2" />
          <span>Weather data unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Cloud className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Weather in {weather.name}</h2>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <img 
            src={weather.weather[0].icon}
            alt={weather.weather[0].description}
            className="w-20 h-20 rounded-full object-cover"
          />
          <span className="text-gray-600 capitalize mt-2">{weather.weather[0].description}</span>
        </div>
        
        <div className="text-center">
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 text-red-500 mr-1" />
            <span className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</span>
          </div>
          <div className="text-sm text-gray-600">Feels like: {Math.round(weather.main.feels_like)}°C</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <Wind className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-gray-700">{weather.wind.speed.toFixed(1)} km/h</span>
        </div>
        <div className="flex items-center">
          <Droplets className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-gray-700">{weather.main.humidity}%</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;