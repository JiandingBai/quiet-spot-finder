
import { useState, useEffect } from 'react';
import { Location } from '@/types';

interface LocationMarkerProps {
  location: Location;
  map: google.maps.Map | null;
}

const LocationMarker = ({ location, map }: LocationMarkerProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  // Create marker when map changes
  useEffect(() => {
    if (!map || !window.google) return;

    // Create the marker
    const newMarker = new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map,
      title: location.name,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: getColorForQuietness(location.noiseLevel || 0),
        fillOpacity: 0.6,
        strokeWeight: 1,
        strokeColor: '#ffffff',
        scale: 10,
      },
    });

    // Create info window content
    const contentString = `
      <div class="p-2 max-w-[200px]">
        <h3 class="font-semibold text-sm">${location.name}</h3>
        <p class="text-xs text-gray-500">${location.description || ''}</p>
        <div class="mt-2">
          <a href="/location/${location.id}" class="text-xs text-quiet-500 hover:underline">View Details</a>
        </div>
      </div>
    `;

    // Create info window
    const newInfoWindow = new window.google.maps.InfoWindow({
      content: contentString,
    });

    // Add click listener
    newMarker.addListener('click', () => {
      newInfoWindow.open({
        anchor: newMarker,
        map,
      });
      setIsInfoOpen(true);
    });

    // Close info window listener
    newInfoWindow.addListener('closeclick', () => {
      setIsInfoOpen(false);
    });

    setMarker(newMarker);
    setInfoWindow(newInfoWindow);

    return () => {
      if (newMarker) {
        newMarker.setMap(null);
      }
      if (newInfoWindow) {
        newInfoWindow.close();
      }
    };
  }, [map, location]);

  // Helper function to determine color based on quietness level
  function getColorForQuietness(level: number): string {
    if (level >= 8) return '#4CAF50'; // Green for very quiet
    if (level >= 5) return '#FFC107'; // Yellow for moderate
    return '#F44336'; // Red for noisy
  }

  // No need to render anything in the component since we're using Google Maps markers
  return null;
};

export default LocationMarker;
