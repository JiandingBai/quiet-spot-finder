
import { useState, useEffect } from "react";
import { getLocations } from "@/services/locationService";
import { Location } from "@/types";
import MapView from "@/components/Map";
import Header from "@/components/Header";
import LocationCard from "@/components/LocationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Info } from "lucide-react";

const Index = () => {
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
        setError("Failed to load quiet spaces. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Find Quiet Spaces at UBC</h1>
            <p className="text-gray-600">
              Discover peaceful spots to study, relax, or focus on campus.
            </p>
          </div>
          
          {isLoading ? (
            <div className="map-container">
              <Skeleton className="w-full h-full" />
            </div>
          ) : error ? (
            <div className="map-container bg-red-50 flex items-center justify-center">
              <div className="text-center p-6">
                <Info className="h-10 w-10 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  {error}
                </h3>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <MapView locations={locations} />
          )}
          
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-quiet-500" />
              <h2 className="text-2xl font-semibold">Featured Quiet Spaces</h2>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <Skeleton className="h-36 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                  <LocationCard key={location._id} location={location} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UBC Quiet Spaces Finder</p>
          <p className="mt-1">A community-driven resource for UBC students</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
