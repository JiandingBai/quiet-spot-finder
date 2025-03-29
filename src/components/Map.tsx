
import { useEffect, useRef, useState } from 'react';
import * as mapboxgl from 'mapbox-gl';
import Map, { NavigationControl, GeolocateControl, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/types';
import LocationMarker from './LocationMarker';
import { toast } from 'sonner';

interface MapViewProps {
  locations: Location[];
}

const MapView = ({ locations }: MapViewProps) => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    // Check if token is already in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  const handleTokenSubmit = () => {
    if (!tokenInput.trim()) {
      toast.error('Please enter a valid Mapbox token');
      return;
    }
    
    // Save token to localStorage
    localStorage.setItem('mapbox_token', tokenInput);
    setMapboxToken(tokenInput);
    toast.success('Mapbox token saved successfully!');
  };

  const handleFocusUBC = () => {
    mapRef.current?.flyTo({
      center: [-123.2460, 49.2606], // UBC coordinates
      zoom: 14,
      duration: 2000
    });
  };

  if (!mapboxToken) {
    return (
      <div className="map-container flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Mapbox Token Required</h3>
        <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
          To use the map feature, please enter your Mapbox public token. You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-quiet-500 hover:underline">mapbox.com</a>.
        </p>
        
        <div className="flex w-full max-w-md gap-2">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Enter your Mapbox token"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-quiet-400"
          />
          <button
            onClick={handleTokenSubmit}
            className="px-4 py-2 bg-quiet-400 text-white rounded-md hover:bg-quiet-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -123.2460,
          latitude: 49.2606,
          zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          positionOptions={{ enableHighAccuracy: true }}
        />
        
        {locations.map(location => (
          <LocationMarker key={location._id} location={location} />
        ))}
      </Map>
      
      <button
        onClick={handleFocusUBC}
        className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-md text-sm font-medium text-quiet-600 hover:bg-gray-50 transition-colors"
      >
        Focus on UBC
      </button>
    </div>
  );
};

export default MapView;
