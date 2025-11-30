import {Env} from '@/lib/env';

const BASE_URL = 'http://api.weatherstack.com/current';

export type WeatherData = {
  current: {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
    wind_speed: number;
    humidity: number;
    feelslike: number;
  };
  location: {
    name: string;
    country: string;
    localtime: string;
  };
};

export const getWeather = async (
  query: string = 'New York',
): Promise<WeatherData> => {
  if (!Env.WEATHER_API_KEY || Env.WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('Missing Weatherstack API Key');
  }

  const response = await fetch(
    `${BASE_URL}?access_key=${Env.WEATHER_API_KEY}&query=${query}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.info || 'Weather API Error');
  }

  return data;
};
