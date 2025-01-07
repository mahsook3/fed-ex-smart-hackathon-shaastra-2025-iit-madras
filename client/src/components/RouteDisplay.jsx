import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  Circle,
  Flag,
  MapPin,
  Eye,
  EyeOff,
  Map,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TrafficIncidents from "./TrafficIncidents";
import AirQuality from "./AirQuality";
import WeaterDetails from "./WeaterDetails";
import RouteDetails from "./RouteDetails";
import RouteInstructions from "./RouteInstructions";
import RouteHeader from "./RouteHeader";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const FitBoundsToRoute = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions?.length) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

const RouteDisplay = () => {
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [sourceDisplay, setSourceDisplay] = useState("");
  const [destinationDisplay, setDestinationDisplay] = useState("");
  const [showTraffic, setShowTraffic] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [instructions, setInstructions] = useState([]);
  const [vehicleType, setVehicleType] = useState("car");
  const mapRef = useRef();
  const [airQuality, setAirQuality] = useState("Unavailable");
  const [weather, setWeather] = useState("Unavailable");
  const [temperature, setTemperature] = useState("Unavailable");

  const fetchSuggestions = async (query, setSuggestions) => {
    try {
      const apiKey = "API";
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(
          query
        )}.json?key=${apiKey}&limit=5`
      );
      const data = await response.json();
      const suggestions = data.results.map((result) => ({
        name: result.address.freeformAddress,
        lat: result.position.lat,
        lng: result.position.lon,
      }));
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectSuggestion = (suggestion, setField, setDisplayField) => {
    setField(`${suggestion.lat},${suggestion.lng}`);
    setDisplayField(suggestion.name);
    setSourceSuggestions([]);
    setDestinationSuggestions([]);
  };

  const handleGetRoute = async () => {
    if (!source || !destination) return;
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/route?source=${source}&destination=${destination}&vehicle_type=${vehicleType}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRouteData(data);
      setInstructions(data.routes[0].guidance.instructions);
    } catch (e) {
      console.error("Error fetching route data:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col relative">
      <div className="z-50">
        <RouteHeader
          showTraffic={showTraffic}
          setShowTraffic={setShowTraffic}
          showAirQuality={showAirQuality}
          setShowAirQuality={setShowAirQuality}
          showWeather={showWeather}
          setShowWeather={setShowWeather}
          sourceDisplay={sourceDisplay}
          setSourceDisplay={setSourceDisplay}
          destinationDisplay={destinationDisplay}
          setDestinationDisplay={setDestinationDisplay}
          fetchSuggestions={fetchSuggestions}
          sourceSuggestions={sourceSuggestions}
          handleSelectSuggestion={handleSelectSuggestion}
          setSource={setSource}
          setDestination={setDestination}
          destinationSuggestions={destinationSuggestions}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
          handleGetRoute={handleGetRoute}
          isLoading={isLoading}
          setSourceSuggestions={setSourceSuggestions}
          setDestinationSuggestions={setDestinationSuggestions}
        />
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routeData?.routes?.[0]?.guidance && (
            <>
              <Polyline
                positions={routeData.routes[0].guidance.instructions.map(
                  (instruction) => [
                    instruction.point.latitude,
                    instruction.point.longitude,
                  ]
                )}
                color="blue"
                weight={3}
              />
              <FitBoundsToRoute
                positions={routeData.routes[0].guidance.instructions.map(
                  (instruction) => [
                    instruction.point.latitude,
                    instruction.point.longitude,
                  ]
                )}
              />
              {showTraffic && (
                <TrafficIncidents source={source} destination={destination} />
              )}
              {showAirQuality && (
                <AirQuality
                  routePositions={routeData.routes[0].guidance.instructions.map(
                    (instruction) => [
                      instruction.point.latitude,
                      instruction.point.longitude,
                    ]
                  )}
                  setAirQuality={setAirQuality}
                />
              )}
              {showWeather && (
                <WeaterDetails
                  routePositions={routeData.routes[0].guidance.instructions.map(
                    (instruction) => [
                      instruction.point.latitude,
                      instruction.point.longitude,
                    ]
                  )}
                  setWeather={setWeather}
                  setTemperature={setTemperature}
                />
              )}
            </>
          )}
        </MapContainer>

        <div className="absolute left-4 top-4 z-[1000]">
          <RouteInstructions instructions={instructions} />
        </div>

        <div className="absolute right-4 top-4 z-[1000]">
          <RouteDetails
            routeData={routeData}
            sourceDisplay={sourceDisplay}
            destinationDisplay={destinationDisplay}
            vehicleType={vehicleType}
            instructions={instructions}
            airQuality={airQuality}
            weather={weather}
            temperature={temperature}
          />
        </div>

        {error && (
          <div className="absolute top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDisplay;