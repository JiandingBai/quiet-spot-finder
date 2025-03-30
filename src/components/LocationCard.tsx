
import { Card, CardContent } from "@/components/ui/card";
import { Location } from "@/types";
import { useNavigate } from "react-router-dom";
import { MapPin, Users } from "lucide-react";

interface LocationCardProps {
  location: Location;
  className?: string;
}

const LocationCard = ({ location, className }: LocationCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/location/${location._id}`);
  };
  
  // Helper function to determine color based on rating level
  function getColorForRating(level: number): string {
    if (level >= 4) return 'bg-green-500';
    if (level >= 2.5) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="h-36 overflow-hidden">
        <img 
          src={location.imageUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000'} 
          alt={location.name || location.address}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{location.name || location.address}</h3>
        
        <div className="mb-3 flex items-center">
          <div className={`h-2 w-12 rounded ${getColorForRating(location.rating)}`}></div>
          <span className="ml-2 text-sm">{location.rating.toFixed(1)}/5</span>
        </div>
        
        <div className="text-sm text-gray-500 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="truncate">{location.address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>
              {location.numReviews} {location.numReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
