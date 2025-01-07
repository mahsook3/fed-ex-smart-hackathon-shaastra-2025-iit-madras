import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle } from 'lucide-react';

const getWeatherIcon = (weatherCode) => {
  const iconProps = { size: 20 };
  switch (weatherCode) {
    case 0:
      return <Sun {...iconProps} color="yellow" />;
    case 1:
    case 2:
    case 3:
      return <Cloud {...iconProps} color="gray" />;
    case 45:
    case 48:
      return <CloudFog {...iconProps} color="lightgray" />;
    case 51:
    case 53:
    case 55:
      return <CloudDrizzle {...iconProps} color="lightblue" />;
    case 56:
    case 57:
      return <CloudDrizzle {...iconProps} color="lightblue" />;
    case 61:
    case 63:
    case 65:
      return <CloudRain {...iconProps} color="blue" />;
    case 66:
    case 67:
      return <CloudRain {...iconProps} color="blue" />;
    case 71:
    case 73:
    case 75:
      return <CloudSnow {...iconProps} color="white" />;
    case 77:
      return <CloudSnow {...iconProps} color="white" />;
    case 80:
    case 81:
    case 82:
      return <CloudRain {...iconProps} color="blue" />;
    case 85:
    case 86:
      return <CloudSnow {...iconProps} color="white" />;
    case 95:
    case 96:
    case 99:
      return <CloudLightning {...iconProps} color="purple" />;
    default:
      return <Cloud {...iconProps} color="gray" />;
  }
};

const createCustomIcon = (weatherCode) => {
  return L.divIcon({
    html: ReactDOMServer.renderToString(getWeatherIcon(weatherCode)),
    className: 'custom-icon',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10],
  });
};

const WeaterDetails = ({ routePositions, setWeather, setTemperature }) => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
      }
    };

    const getEquidistantPoints = (positions) => {
      if (!positions || positions.length < 2) return [];
      
      const totalPoints = 10;
      const points = [];
      const totalSegments = positions.length - 1;
      const segmentStep = Math.floor(totalSegments / (totalPoints - 1));
      
      for (let i = 0; i < totalPoints; i++) {
        const index = Math.min(i * segmentStep, totalSegments);
        points.push(positions[index]);
      }
      
      return points;
    };

    const loadWeatherData = async () => {
      if (!routePositions || routePositions.length === 0) return;

      const points = getEquidistantPoints(routePositions);
      const weatherPromises = points.map(point => 
        fetchWeather(point[0], point[1])
      );

      const results = await Promise.all(weatherPromises);
      const filteredResults = results.filter(Boolean).map((result, index) => ({
        ...result,
        position: points[index]
      }));
      setWeatherData(filteredResults);

      if (filteredResults.length > 0) {
        setWeather(filteredResults[0].hourly.weathercode[0]);
        setTemperature(filteredResults[0].hourly.temperature_2m[0]);
      }
    };

    loadWeatherData();
  }, [routePositions, setWeather, setTemperature]);

  return (
    <>
      {weatherData.map((data, index) => (
        <Marker
          key={index}
          position={data.position}
          icon={createCustomIcon(data.hourly?.weathercode?.[0])}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">Weather Details</h3>
              <div className="space-y-1">
                <p><span className="font-semibold">Temperature:</span> {data.hourly?.temperature_2m?.[0] ?? 'N/A'}°C</p>
                <p><span className="font-semibold">Weather:</span> {data.hourly?.weathercode?.[0] ?? 'N/A'}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default WeaterDetails;