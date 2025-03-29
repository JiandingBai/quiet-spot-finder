
import { Location } from "@/types";
import { Marker, Popup } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import QuietnessMeter from "./QuietnessMeter";
import { Button } from "./ui/button";

interface LocationMarkerProps {
  location: Location;
}

const LocationMarker = ({ location }: LocationMarkerProps) => {
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
  
  return (
    <Marker
      longitude={location.location.coordinates[0]}
      latitude={location.location.coordinates[1]}
      anchor="bottom"
    >
      <div className="relative group">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transform transition-transform group-hover:scale-110"
          style={{ backgroundColor: getMarkerColor() }}
        >
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <div className="bg-white p-2 rounded-lg shadow-lg whitespace-nowrap text-xs font-medium">
            {location.name}
          </div>
        </div>
      </div>
      
      <Popup
        longitude={location.location.coordinates[0]}
        latitude={location.location.coordinates[1]}
        anchor="bottom"
        offset={[0, -30]}
        closeButton={false}
        closeOnClick={false}
        maxWidth="300px"
      >
        <div className="p-2">
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
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
