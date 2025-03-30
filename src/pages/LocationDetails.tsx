import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLocationById, getReviewsForLocation } from "@/services/locationService";
import { Location, Review } from "@/types";
import Header from "@/components/Header";
import QuietnessMeter from "@/components/QuietnessMeter";
import { MapPin, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LocationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const fetchedLocation = await getLocationById(id!);
        setLocation(fetchedLocation);
        setLocationError(null);
      } catch (err) {
        console.error("Error fetching location:", err);
        setLocationError("Failed to load location. Please try again later.");
      } finally {
        setIsLoadingLocation(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const fetchedReviews = await getReviewsForLocation(id!);
        setReviews(fetchedReviews);
        setReviewsError(null);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("Failed to load reviews. Please try again later.");
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchLocation();
    fetchReviews();
  }, [id]);

  const renderLocationDetails = () => {
    if (isLoadingLocation) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      );
    }

    if (locationError) {
      return (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-red-700 mb-4">{locationError}</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!location) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Location not found</h3>
          <p className="text-gray-600 mb-4">
            The requested location could not be found.
          </p>
          <Link to="/">
            <button className="px-4 py-2 bg-quiet-400 text-white rounded-md hover:bg-quiet-500 transition-colors">
              Go to Map
            </button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{location.name || "Unnamed Location"}</h2>
        <p className="text-gray-700">{location.description || "No description available."}</p>
        
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{location.address}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-500">Average Quietness</div>
            <QuietnessMeter level={location.rating} />
          </div>
        </div>
        
        {location.imageUrl && (
          <img src={location.imageUrl} alt={location.name} className="rounded-lg shadow-md" />
        )}
        
        <Link to={`/reviews?locationId=${location._id}`} className="inline-block bg-quiet-400 hover:bg-quiet-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Share Your Experience
        </Link>
      </div>
    );
  };

  // Update the review rendering section to match our schema
  const renderReviews = () => {
    if (isLoadingReviews) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (reviewsError) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Failed to load reviews.</p>
        </div>
      );
    }

    if (!reviews || reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{review.name}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(review.datetime).toLocaleDateString()} • {review.weather.replace('_', ' ')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Quietness</div>
                  <QuietnessMeter level={review.noiseLevel} size="sm" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Busyness</div>
                  <QuietnessMeter level={review.busyLevel} size="sm" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{review.textReview}</p>
          </div>
        ))}
      </div>
    );
  };

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
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg border p-6">
              {renderLocationDetails()}
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              {renderReviews()}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UBC Quiet Spaces Finder</p>
          <p className="mt-1">A community-driven resource for UBC students</p>
        </div>
      </footer>
    </div>
  );
};

export default LocationDetails;
