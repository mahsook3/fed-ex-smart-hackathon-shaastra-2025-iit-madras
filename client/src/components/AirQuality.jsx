import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Siren } from 'lucide-react';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
};

const getAQILevel = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const getAirQualityIcon = (aqi) => {
  const iconProps = { size: 20 };
  if (aqi <= 50) return <Siren {...iconProps} color="green" />;
  if (aqi <= 100) return <Siren {...iconProps} color="yellow" />;
  if (aqi <= 150) return <Siren {...iconProps} color="orange" />;
  if (aqi <= 200) return <Siren {...iconProps} color="red" />;
  if (aqi <= 300) return <Siren {...iconProps} color="purple" />;
  return <Siren {...iconProps} color="brown" />;
};

const createCustomIcon = (aqi) => {
  return L.divIcon({
    html: ReactDOMServer.renderToString(getAirQualityIcon(aqi)),
    className: 'custom-icon',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10],
  });
};

const AirQuality = ({ routePositions, setAirQuality }) => {
  const [airQualityData, setAirQualityData] = useState([]);

  useEffect(() => {
    const fetchAirQuality = async (lat, lon) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/air-quality?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching air quality:', error);
        return null;
      }
    };

    const getEquidistantPoints = (positions) => {
      if (!positions || positions.length < 2) return [];
      
      const totalPoints = 5;
      const points = [];
      const totalSegments = positions.length - 1;
      const segmentStep = Math.floor(totalSegments / (totalPoints - 1));
      
      for (let i = 0; i < totalPoints; i++) {
        const index = Math.min(i * segmentStep, totalSegments);
        points.push(positions[index]);
      }
      
      return points;
    };

    const loadAirQualityData = async () => {
      if (!routePositions || routePositions.length === 0) return;

      const points = getEquidistantPoints(routePositions);
      const airQualityPromises = points.map(point => 
        fetchAirQuality(point[0], point[1])
      );

      const results = await Promise.all(airQualityPromises);
      const filteredResults = results.filter(Boolean).map((result, index) => ({
        ...result,
        position: points[index]
      }));
      setAirQualityData(filteredResults);

      if (filteredResults.length > 0) {
        setAirQuality(filteredResults[0].data.aqi);
      }
    };

    loadAirQualityData();
  }, [routePositions, setAirQuality]);

  return (
    <>
      {airQualityData.map((data, index) => (
        <Marker
          key={index}
          position={data.position}
          icon={createCustomIcon(data.data.aqi)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">Air Quality Index</h3>
              <div className={`${getAQIColor(data.data.aqi)} text-white px-3 py-1 rounded-full text-center mb-2`}>
                {data.data.aqi} - {getAQILevel(data.data.aqi)}
              </div>
              <div className="space-y-1">
                <p><span className="font-semibold">PM2.5:</span> {data.data.iaqi.pm25?.v || 'N/A'} µg/m³</p>
                <p><span className="font-semibold">PM10:</span> {data.data.iaqi.pm10?.v || 'N/A'} µg/m³</p>
                <p><span className="font-semibold">Temperature:</span> {data.data.iaqi.t?.v || 'N/A'}°C</p>
                <p><span className="font-semibold">Humidity:</span> {data.data.iaqi.h?.v || 'N/A'}%</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default AirQuality;