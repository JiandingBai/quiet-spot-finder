
import { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Location } from '@/types';
import LocationMarker from './LocationMarker';
import { toast } from 'sonner';

interface MapViewProps {
  locations: Location[];
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

const UBC_CENTER = {
  lat: 49.2606,
  lng: -123.2460
};

const MapView = ({ locations }: MapViewProps) => {
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Load the API key only once on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('google_maps_key');
    if (savedKey) {
      setGoogleApiKey(savedKey);
    }
  }, []);

  // Only initialize the loader when we have a valid API key
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleApiKey || ' ', // Empty space as placeholder when no key is set
    id: 'google-map-script'
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleKeySubmit = () => {
    if (!keyInput.trim()) {
      toast.error('Please enter a valid Google Maps API key');
      return;
    }
    
    // Save key to localStorage
    localStorage.setItem('google_maps_key', keyInput);
    
    // Force a full page reload to reinitialize the Google Maps loader
    // This avoids the error with changing loader options
    window.location.reload();
  };

  const handleFocusUBC = () => {
    if (mapRef.current) {
      mapRef.current.panTo(UBC_CENTER);
      mapRef.current.setZoom(15);
    }
  };

  if (!googleApiKey) {
    return (
      <div className="map-container flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Google Maps API Key Required</h3>
        <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
          To use the map feature, please enter your Google Maps API key. You can get one from the{' '}
          <a 
            href="https://console.cloud.google.com/google/maps-apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-quiet-500 hover:underline"
          >
            Google Cloud Console
          </a>.
        </p>
        
        <div className="flex w-full max-w-md gap-2">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Enter your Google Maps API key"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-quiet-400"
          />
          <button
            onClick={handleKeySubmit}
            className="px-4 py-2 bg-quiet-400 text-white rounded-md hover:bg-quiet-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="map-container flex flex-col items-center justify-center bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Error Loading Google Maps</h3>
        <p className="text-sm text-red-500 mb-4 text-center">
          There was an error loading Google Maps. Please check your API key and try again.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('google_maps_key');
            // Force a page reload to clear any cached Google Maps loader state
            window.location.reload();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Reset API Key
        </button>
      </div>
    );
  }

  // Show loading state while map is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-quiet-500"></div>
      </div>
    );
  }

  return (
    <div className="map-container relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={UBC_CENTER}
        zoom={15}
        onLoad={onMapLoad}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {locations.map(location => (
          <LocationMarker key={location._id} location={location} />
        ))}
      </GoogleMap>
      
      <button
        onClick={handleFocusUBC}
        className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-md text-sm font-medium text-quiet-600 hover:bg-gray-50 transition-colors z-10"
      >
        Focus on UBC
      </button>
    </div>
  );
};

export default MapView;
