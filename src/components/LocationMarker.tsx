
import { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { Location } from "@/types";
import { useNavigate } from "react-router-dom";
import QuietnessMeter from "./QuietnessMeter";
import { Button } from "./ui/button";

interface LocationMarkerProps {
  location: Location;
}

const LocationMarker = ({ location }: LocationMarkerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get color based on quietness level
  const getMarkerColor = () => {
    const level = Math.round(location.averageQuietness);
    switch(level) {
      case 1: return "#f87171"; // red-400
      case 2: return "#fb923c"; // orange-400
      case 3: return "#facc15"; // yellow-400
      case 4: return "#4ade80"; // green-400
      case 5: return "#9b87f5"; // quiet-400
      default: return "#9b87f5";
    }
  };

  const markerPosition = {
    lat: location.location.coordinates[1],
    lng: location.location.coordinates[0]
  };
  
  return (
    <>
      <Marker
        position={markerPosition}
        onClick={() => setIsOpen(true)}
        icon={{
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
          fillColor: getMarkerColor(),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 1.5,
          anchor: new google.maps.Point(12, 22),
        }}
      />
      
      {isOpen && (
        <InfoWindow
          position={markerPosition}
          onCloseClick={() => setIsOpen(false)}
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-bold">{location.name}</h3>
            <div className="my-2">
              <QuietnessMeter level={location.averageQuietness} size="sm" />
            </div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{location.description}</p>
            <Button 
              size="sm" 
              className="w-full bg-quiet-400 hover:bg-quiet-500 text-xs"
              onClick={() => navigate(`/location/${location._id}`)}
            >
              View Details
            </Button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default LocationMarker;
