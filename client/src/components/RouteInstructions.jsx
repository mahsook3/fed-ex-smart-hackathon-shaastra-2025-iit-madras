import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  Circle,
  Flag,
  MapPin,
} from "lucide-react";

const getManeuverIcon = (maneuver) => {
  switch (maneuver) {
    case 'TURN_LEFT':
      return <ArrowLeft className="text-blue-600" />;
    case 'TURN_RIGHT':
      return <ArrowRight className="text-blue-600" />;
    case 'DEPART':
      return <MapPin className="text-green-600" />;
    case 'ARRIVE':
      return <Flag className="text-red-600" />;
    case 'ROUNDABOUT_RIGHT':
      return <Circle className="text-blue-600" />;
    case 'KEEP_RIGHT':
      return <CornerUpRight className="text-blue-600" />;
    case 'BEAR_RIGHT':
      return <CornerUpRight className="text-blue-600" />;
    case 'BEAR_LEFT':
      return <CornerUpLeft className="text-blue-600" />;
    case 'STRAIGHT':
      return <ArrowUp className="text-blue-600" />;
    default:
      return <ArrowUp className="text-gray-600" />;
  }
};

const formatInstruction = (instruction) => {
  const action = instruction.maneuver.replace(/_/g, ' ').toLowerCase();
  const street = instruction.street ? ` onto ${instruction.street}` : '';
  const distance = instruction.routeOffsetInMeters ? 
    ` (${(instruction.routeOffsetInMeters / 1000).toFixed(1)} km)` : '';
  
  return `${action}${street}${distance}`;
};

const RouteInstructions = ({ instructions }) => {
  if (!instructions?.length) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg w-96 max-h-[70vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <MapPin className="text-blue-600" />
        Route Instructions
      </h3>
      <div className="space-y-2">
        {instructions.map((instruction, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <div className="w-6">
              {getManeuverIcon(instruction.maneuver)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {formatInstruction(instruction)}
              </p>
              {instruction.roundaboutExitNumber && (
                <p className="text-xs text-gray-500 mt-1">
                  Take exit {instruction.roundaboutExitNumber}
                </p>
              )}
              {instruction.travelTimeInSeconds > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  ~{Math.round(instruction.travelTimeInSeconds / 60)} min
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteInstructions;