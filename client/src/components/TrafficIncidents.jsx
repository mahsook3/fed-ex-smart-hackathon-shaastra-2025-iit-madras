import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { 
    AlertCircle, 
    Construction, 
    Car, 
    Ban,
    Clock,
    AlertTriangle 
  } from 'lucide-react';

const formatDateTime = (utcString) => {
    return new Date(utcString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

const TrafficIncidents = ({ source, destination }) => {
  const [incidents, setIncidents] = useState([]);

  const calculateBoundingBox = (source, destination) => {
    if (!source || !destination) return null;

    const [sourceLat, sourceLng] = source.split(',').map(Number);
    const [destLat, destLng] = destination.split(',').map(Number);

    const minLat = Math.min(sourceLat, destLat);
    const maxLat = Math.max(sourceLat, destLat);
    const minLng = Math.min(sourceLng, destLng);
    const maxLng = Math.max(sourceLng, destLng);

    // Add padding to bounding box
    const padding = 0.1; // approximately 11km
    return `${minLat - padding},${minLng - padding},${maxLat + padding},${maxLng + padding}`;
  };

  useEffect(() => {
    const fetchTrafficIncidents = async () => {
      const boundingBox = calculateBoundingBox(source, destination);
      if (!boundingBox) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/traffic-incidents?bounding_box=${boundingBox}`
        );
        const data = await response.json();
        setIncidents(data.tm.poi || []);
      } catch (error) {
        console.error('Error fetching traffic incidents:', error);
      }
    };

    if (source && destination) {
      fetchTrafficIncidents();
    }
  }, [source, destination]);

  const getIncidentIcon = (type) => {
    const iconProps = { size: 20 };
    const icons = {
      0: <Construction {...iconProps} color="orange" />, // roadworks
      1: <AlertTriangle {...iconProps} color="red" />, // incident
      2: <Car {...iconProps} color="blue" />, // queuing traffic
      3: <Clock {...iconProps} color="purple" />, // delay
      4: <Ban {...iconProps} color="black" />, // closed
      5: <AlertTriangle {...iconProps} color="yellow" /> // hazard
    };
    return icons[type] || <AlertCircle {...iconProps} color="gray" />; // default warning icon
  };

  const createCustomIcon = (type) => {
    return L.divIcon({
      html: ReactDOMServer.renderToString(getIncidentIcon(type)),
      className: 'custom-icon',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -10],
    });
  };

  return (
    <div>
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.p.y, incident.p.x]}
          icon={createCustomIcon(incident.ty)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{getIncidentIcon(incident.ty)} {incident.t}</h3>
              <p className="text-sm">{incident.d}</p>
              {incident.r && <p className="text-sm">Road: {incident.r}</p>}
              {incident.f && <p className="text-sm">From: {incident.f}</p>}
              {incident.dl && (
                <p className="text-sm">Delay: {Math.round(incident.dl / 60)} minutes</p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                <p>Start: {formatDateTime(incident.sd)}</p>
                {incident.ed && <p>End: {formatDateTime(incident.ed)}</p>}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <div className="mt-4">
        <h3 className="font-bold mb-2">Traffic Incidents</h3>
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div key={incident.id} className="border p-2 rounded">
              <div className="flex items-center gap-2">
                <span>{getIncidentIcon(incident.ty)}</span>
                <h4 className="font-semibold">{incident.t}</h4>
              </div>
              <p className="text-sm text-gray-600">{incident.d}</p>
              {incident.dl && (
                <p className="text-sm text-red-500">
                  Delay: {Math.round(incident.dl / 60)} minutes
                </p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                <p>Start: {formatDateTime(incident.sd)}</p>
                {incident.ed && <p>End: {formatDateTime(incident.ed)}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficIncidents;