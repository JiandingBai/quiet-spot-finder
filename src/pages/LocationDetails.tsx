
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLocationById } from "@/services/locationService";
import { Location, Review } from "@/types";
import Header from "@/components/Header";
import QuietnessMeter from "@/components/QuietnessMeter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  MapPin, 
  CalendarClock, 
  MessageSquare, 
  Clock,
  Tag,
  Wifi,
  Plug
} from "lucide-react";
import { format } from "date-fns";

const LocationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getLocationById(id);
        
        if (!data) {
          setError("Location not found");
        } else {
          setLocation(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setError("Failed to load location details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {error || "Location not found"}
          </h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const renderReviewCard = (review: Review) => (
    <div key={review._id} className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{review.nickname}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarClock size={14} />
            <span>{formatDate(review.visitDate)} ({review.timeOfDay})</span>
          </div>
        </div>
        <div className="w-32">
          <QuietnessMeter level={review.quietnessRating} size="sm" />
        </div>
      </div>
      <p className="text-gray-700 mt-2">{review.comment}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center text-quiet-500 hover:text-quiet-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg overflow-hidden border mb-6">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={location.imageUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000'} 
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-2">{location.name}</h1>
                  
                  <div className="mb-4">
                    <QuietnessMeter level={location.averageQuietness} size="lg" />
                  </div>
                  
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 text-quiet-400 shrink-0 mt-0.5" />
                    <span>{location.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Tag className="h-5 w-5 text-quiet-400" />
                    <span className="capitalize">{location.category}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{location.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-3">
                      {location.amenities.map((amenity, index) => (
                        <div 
                          key={index} 
                          className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity === 'wifi' && <Wifi className="h-3.5 w-3.5" />}
                          {amenity === 'power outlets' && <Plug className="h-3.5 w-3.5" />}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={`/reviews?locationId=${location._id}`}>
                    <Button className="bg-quiet-400 hover:bg-quiet-500">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Write a Review
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <span className="text-sm text-gray-500">
                    {location.reviews.length} {location.reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
                
                {location.reviews.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No reviews yet.</p>
                    <Link to={`/reviews?locationId=${location._id}`}>
                      <Button variant="outline" className="border-quiet-400 text-quiet-600">
                        Be the first to write a review
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    {location.reviews.map(review => renderReviewCard(review))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg border p-6 mb-6">
                <h3 className="font-semibold mb-4">Quietness by Time of Day</h3>
                <div className="space-y-4">
                  {['morning', 'afternoon', 'evening', 'night'].map(time => {
                    const timeReviews = location.reviews.filter(r => r.timeOfDay === time);
                    const avgRating = timeReviews.length > 0
                      ? timeReviews.reduce((sum, r) => sum + r.quietnessRating, 0) / timeReviews.length
                      : 0;
                    
                    return (
                      <div key={time} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-quiet-400" />
                          <span className="capitalize">{time}</span>
                        </div>
                        
                        {timeReviews.length > 0 ? (
                          <QuietnessMeter level={avgRating} size="sm" showLabel={false} className="w-32" />
                        ) : (
                          <span className="text-xs text-gray-400">No data</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-quiet-100 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-quiet-400">•</span>
                    <span>Best time to visit: {location.reviews.length > 0 ? 'Morning' : 'Unknown'}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-quiet-400">•</span>
                    <span>Avoid between classes for more quietness</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-quiet-400">•</span>
                    <span>Check UBC academic calendar for exam periods when spaces may be fuller</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UBC Quiet Spaces Finder</p>
          <p className="mt-1">A community-driven resource for UBC students</p>
        </div>
      </footer>
    </div>
  );
};

export default LocationDetails;
