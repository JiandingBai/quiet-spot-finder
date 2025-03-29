
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getLocations } from "@/services/locationService";
import { Location } from "@/types";
import Header from "@/components/Header";
import ReviewForm from "@/components/ReviewForm";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("locationId");
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const data = await getLocations();
        setLocations(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load locations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-red-700 mb-4">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (locations.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No locations available</h3>
          <p className="text-gray-600 mb-4">
            There are no quiet spaces to review at the moment.
          </p>
          <Link to="/">
            <button className="px-4 py-2 bg-quiet-400 text-white rounded-md hover:bg-quiet-500 transition-colors">
              Go to Map
            </button>
          </Link>
        </div>
      );
    }

    return <ReviewForm locations={locations} preselectedLocationId={locationId || undefined} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <Link to={locationId ? `/location/${locationId}` : "/"} className="inline-flex items-center text-quiet-500 hover:text-quiet-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locationId ? "Back to Location" : "Back to Map"}
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border p-6 mb-10">
              <h1 className="text-2xl font-bold mb-6">Share Your Experience</h1>
              <p className="text-gray-600 mb-6">
                Help others find the perfect quiet space by sharing your experience.
                Rate the quietness level and provide helpful details about your visit.
              </p>
              
              {renderContent()}
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

export default Reviews;
