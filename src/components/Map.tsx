
import { useEffect, useRef, useState, memo } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Location } from '@/types';
import LocationMarker from './LocationMarker';
import { toast } from 'sonner';

interface MapViewProps {
  locations: Location[];
}

// Separate this as a constant outside the component to avoid re-creation
const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

const UBC_CENTER = {
  lat: 49.2606,
  lng: -123.2460
};

// Create a lazy-loaded Google Maps script component
const GoogleMapsScript = memo(({ apiKey }: { apiKey: string }) => {
  useEffect(() => {
    // Only load the script if we have an API key
    if (!apiKey) return;
    
    // Check if script is already loaded
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) return;

    // Create and append the script
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Clean up the script tag if component unmounts
      const scriptTag = document.getElementById('google-maps-script');
      if (scriptTag) document.head.removeChild(scriptTag);
    };
  }, [apiKey]);

  return null;
});

const MapView = ({ locations }: MapViewProps) => {
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Load the API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('google_maps_key');
    if (savedKey) {
      setGoogleApiKey(savedKey);
    }
  }, []);

  // Check if the Google Maps API is loaded
  useEffect(() => {
    if (!googleApiKey) {
      setMapLoaded(false);
      return;
    }

    const checkIfLoaded = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
      } else {
        setTimeout(checkIfLoaded, 100);
      }
    };

    checkIfLoaded();

    // Set up a timeout to stop checking after 10 seconds
    const timeout = setTimeout(() => {
      if (!mapLoaded) {
        toast.error('Google Maps failed to load. Please check your API key and try again.');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [googleApiKey, mapLoaded]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleKeySubmit = () => {
    if (!keyInput.trim()) {
      toast.error('Please enter a valid Google Maps API key');
      return;
    }
    
    // Save key to localStorage
    localStorage.setItem('google_maps_key', keyInput);
    
    // Update state with the new key
    setGoogleApiKey(keyInput);
    setMapLoaded(false); // Reset the map loaded state
    toast.success('Google Maps API key saved successfully!');
  };

  const handleResetKey = () => {
    localStorage.removeItem('google_maps_key');
    setGoogleApiKey('');
    setMapLoaded(false);
  };

  const handleFocusUBC = () => {
    if (mapRef.current) {
      mapRef.current.panTo(UBC_CENTER);
      mapRef.current.setZoom(15);
    }
  };

  // Render the API Key input form if no key is provided
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

  // Add the Google Maps script to the document
  return (
    <>
      <GoogleMapsScript apiKey={googleApiKey} />
      
      {!mapLoaded && (
        <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-quiet-500"></div>
        </div>
      )}
      
      {mapLoaded && window.google && window.google.maps && (
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
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleFocusUBC}
              className="bg-white px-3 py-2 rounded-md shadow-md text-sm font-medium text-quiet-600 hover:bg-gray-50 transition-colors z-10"
            >
              Focus on UBC
            </button>
            
            <button
              onClick={handleResetKey}
              className="bg-white px-3 py-2 rounded-md shadow-md text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors z-10"
            >
              Reset API Key
            </button>
          </div>
        </div>
      )}
      
      {mapLoaded && !window.google?.maps && (
        <div className="map-container flex flex-col items-center justify-center bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Error Loading Google Maps</h3>
          <p className="text-sm text-red-500 mb-4 text-center">
            There was an error loading Google Maps. Please check your API key and try again.
          </p>
          <button
            onClick={handleResetKey}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reset API Key
          </button>
        </div>
      )}
    </>
  );
};

export default MapView;
