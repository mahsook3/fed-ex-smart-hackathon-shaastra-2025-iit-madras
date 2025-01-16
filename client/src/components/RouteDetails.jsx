'use client'

import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { MapPin, Clock, Calendar, AlertTriangle, Wind, Thermometer, Car, Bike, FootprintsIcon as Walk, Truck } from 'lucide-react'

const weatherDescriptions = {
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
  95: 'Slight thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Violent thunderstorm with hail'
}

const vehicleIcons = {
  car: Car,
  truck: Truck,
  bicycle: Bike,
  pedestrian: Walk
}

const RouteDetails = ({ 
  routeData, 
  sourceDisplay, 
  destinationDisplay, 
  vehicleType, 
  instructions = [], 
  airQuality = 'Unavailable', 
  weather = 0, 
  temperature = 'Unavailable' 
}) => {
  const [summaryText, setSummaryText] = useState('')
  const hasFetchedSummary = useRef(false)

  useEffect(() => {
    if (!routeData?.routes?.[0]?.summary || hasFetchedSummary.current) return

    const summary = routeData.routes[0].summary
    const arrivalTime = new Date(summary.arrivalTime)
    const departureTime = new Date(summary.departureTime)

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are my route assistant, so I want to go to ${destinationDisplay} from ${sourceDisplay} by my ${vehicleType}. Here are the weather details, air pollution, and traffic details. By this, give me a short summary with the given data. Don't write any extra content. 
          Total Distance: ${(summary.lengthInMeters / 1000).toFixed(2)} km, 
          Estimated Travel Time: ${Math.round(summary.travelTimeInSeconds / 60)} minutes, 
          Departure Time: ${departureTime.toLocaleTimeString()}, 
          Arrival Time: ${arrivalTime.toLocaleTimeString()}, 
          Traffic Delay: ${summary.trafficDelayInSeconds > 0 ? Math.round(summary.trafficDelayInSeconds / 60) + ' minutes' : 'No delay'}
          Instructions: ${instructions.join(', ')}
          Air Quality: ${airQuality}
          Weather: ${weatherDescriptions[weather] || 'Unavailable'}
          Temperature: ${temperature}.
          So write it as like human speaking tone.
          `
        }]
      }]
    }

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=API', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      const generatedSummary = data.candidates[0].content.parts[0].text
      setSummaryText(generatedSummary)
      hasFetchedSummary.current = true
    })
    .catch(error => console.error('Error fetching summary:', error))

    return () => {
      hasFetchedSummary.current = false
    }
  }, [routeData, sourceDisplay, destinationDisplay, vehicleType, instructions, airQuality, weather, temperature])

  useEffect(() => {
    if (summaryText && routeData?.routes?.[0]?.summary && sourceDisplay && destinationDisplay && vehicleType) {
      const utterance = new SpeechSynthesisUtterance(summaryText)
      window.speechSynthesis.speak(utterance)
    }
  }, [summaryText, routeData, sourceDisplay, destinationDisplay, vehicleType])

  if (!routeData?.routes?.[0]?.summary) return null

  const summary = routeData.routes[0].summary
  const arrivalTime = new Date(summary.arrivalTime)
  const departureTime = new Date(summary.departureTime)
  const VehicleIcon = vehicleIcons[vehicleType]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Route Summary</h3>
          <VehicleIcon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Distance</p>
              <p className="text-lg font-semibold text-gray-800">{(summary.lengthInMeters / 1000).toFixed(2)} km</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Time</p>
              <p className="text-lg font-semibold text-gray-800">{Math.round(summary.travelTimeInSeconds / 60)} min</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Departure</p>
              <p className="text-lg font-semibold text-gray-800">{departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Arrival</p>
              <p className="text-lg font-semibold text-gray-800">{arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
        </div>
        
        {summary.trafficDelayInSeconds > 0 && (
          <div className="flex items-center space-x-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Traffic Delay</p>
              <p className="text-lg font-semibold">{Math.round(summary.trafficDelayInSeconds / 60)} min</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Air Quality</p>
              <p className="text-lg font-semibold text-gray-800">{airQuality}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Temperature</p>
              <p className="text-lg font-semibold text-gray-800">{temperature}°C</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Weather</p>
          <p className="text-lg font-semibold text-gray-800">{weatherDescriptions[weather] || 'Unavailable'}</p>
        </div>
        
        {summaryText && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">{summaryText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

RouteDetails.propTypes = {
  routeData: PropTypes.object.isRequired,
  sourceDisplay: PropTypes.string.isRequired,
  destinationDisplay: PropTypes.string.isRequired,
  vehicleType: PropTypes.oneOf(['car', 'truck', 'bicycle', 'pedestrian']).isRequired,
  instructions: PropTypes.arrayOf(PropTypes.string),
  airQuality: PropTypes.string,
  weather: PropTypes.number,
  temperature: PropTypes.string
}

export default RouteDetails