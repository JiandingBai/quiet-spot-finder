
import { Card, CardContent } from "@/components/ui/card";
import { Location } from "@/types";
import { useNavigate } from "react-router-dom";
import QuietnessMeter from "./QuietnessMeter";
import { Clock, MapPin, Users } from "lucide-react";

interface LocationCardProps {
  location: Location;
  className?: string;
}

const LocationCard = ({ location, className }: LocationCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/location/${location._id}`);
  };
  
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="h-36 overflow-hidden">
        <img 
          src={location.imageUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000'} 
          alt={location.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{location.name}</h3>
        
        <div className="mb-3">
          <QuietnessMeter level={location.averageQuietness} />
        </div>
        
        <div className="text-sm text-gray-500 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="truncate">{location.address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>
              {location.reviews.length} {location.reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span className="capitalize">{location.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
