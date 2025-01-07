import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import SuggestionsList from './SuggestionsList';

const RouteHeader = ({
  showTraffic,
  setShowTraffic,
  showAirQuality,
  setShowAirQuality,
  showWeather,
  setShowWeather,
  sourceDisplay,
  setSourceDisplay,
  destinationDisplay,
  setDestinationDisplay,
  fetchSuggestions,
  sourceSuggestions,
  handleSelectSuggestion,
  setSource,
  setDestination,
  destinationSuggestions,
  vehicleType,
  setVehicleType,
  handleGetRoute,
  isLoading,
  setSourceSuggestions,
  setDestinationSuggestions
}) => {
  return (
    <div className="bg-white shadow-md p-4 flex flex-col relative z-50">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`p-2 rounded-md flex items-center gap-2 transition duration-300 ease-in-out ${
              showTraffic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {showTraffic ? <Eye size={20} /> : <EyeOff size={20} />}
            <span className="font-medium">Traffic</span>
          </button>
          <button
            onClick={() => setShowAirQuality(!showAirQuality)}
            className={`p-2 rounded-md flex items-center gap-2 transition duration-300 ease-in-out ${
              showAirQuality ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {showAirQuality ? <Eye size={20} /> : <EyeOff size={20} />}
            <span className="font-medium">Air Quality</span>
          </button>
          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`p-2 rounded-md flex items-center gap-2 transition duration-300 ease-in-out ${
              showWeather ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {showWeather ? <Eye size={20} /> : <EyeOff size={20} />}
            <span className="font-medium">Weather</span>
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={sourceDisplay}
              onChange={(e) => {
                setSourceDisplay(e.target.value);
                fetchSuggestions(e.target.value, setSourceSuggestions);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md w-full"
              placeholder="Source"
            />
            {sourceSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md z-10">
                <SuggestionsList
                  suggestions={sourceSuggestions}
                  handleSelectSuggestion={handleSelectSuggestion}
                  setSource={setSource}
                  setSourceDisplay={setSourceDisplay}
                />
              </div>
            )}
          </div>

          <div className="relative w-full">
            <input
              type="text"
              value={destinationDisplay}
              onChange={(e) => {
                setDestinationDisplay(e.target.value);
                fetchSuggestions(e.target.value, setDestinationSuggestions);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md w-full"
              placeholder="Destination"
            />
            {destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md z-10">
                <SuggestionsList
                  suggestions={destinationSuggestions}
                  handleSelectSuggestion={handleSelectSuggestion}
                  setSource={setDestination}
                  setSourceDisplay={setDestinationDisplay}
                />
              </div>
            )}
          </div>

          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="car">Car</option>
            <option value="truck">Truck</option>
            <option value="bicycle">Bicycle</option>
            <option value="pedestrian">Pedestrian</option>
          </select>

          <button
            onClick={handleGetRoute}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          >
            {isLoading ? "Loading..." : "Get Route"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteHeader;