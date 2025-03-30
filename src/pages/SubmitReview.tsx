
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLocations, addReview } from "@/services/locationService";
import { Location } from "@/types";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

const SubmitReview = () => {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("locationId");
  
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    location: locationId || "",
    name: "",
    noiseLevel: 3,
    busyLevel: 3,
    textReview: "",
    weather: "sunny" as const,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.location) errors.location = "Please select a location";
    if (!formData.name || formData.name.length < 2) errors.name = "Name must be at least 2 characters";
    if (!formData.textReview || formData.textReview.length < 10) errors.textReview = "Review must be at least 10 characters";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit the review
      await addReview({
        location: formData.location,
        name: formData.name,
        noiseLevel: Number(formData.noiseLevel),
        busyLevel: Number(formData.busyLevel),
        textReview: formData.textReview,
        weather: formData.weather,
        datetime: new Date().toISOString(),
      });
      
      // Navigate to the location details page
      navigate(`/location/${formData.location}`);
    } catch (error) {
      console.error(error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <button 
              onClick={() => navigate(locationId ? `/location/${locationId}` : "/")}
              className="inline-flex items-center text-quiet-500 hover:text-quiet-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locationId ? "Back to Location" : "Back to Map"}
            </button>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border p-6 mb-10">
              <h1 className="text-2xl font-bold mb-6">Share Your Experience</h1>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Select Location</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={isSubmitting || !!locationId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-quiet-400"
                  >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name || location.address}
                      </option>
                    ))}
                  </select>
                  {validationErrors.location && <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-quiet-400"
                  />
                  {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="noiseLevel" className="block text-gray-700 font-medium mb-2">Noise Level (1-5)</label>
                    <div className="flex items-center gap-4">
                      <input
                        id="noiseLevel"
                        name="noiseLevel"
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={formData.noiseLevel}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <span className="text-lg font-semibold w-8 text-center">
                        {formData.noiseLevel}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">1 = Very loud, 5 = Very quiet</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="busyLevel" className="block text-gray-700 font-medium mb-2">Busy Level (1-5)</label>
                    <div className="flex items-center gap-4">
                      <input
                        id="busyLevel"
                        name="busyLevel"
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={formData.busyLevel}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <span className="text-lg font-semibold w-8 text-center">
                        {formData.busyLevel}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">1 = Very busy, 5 = Not busy</p>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="weather" className="block text-gray-700 font-medium mb-2">Weather</label>
                  <select
                    id="weather"
                    name="weather"
                    value={formData.weather}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-quiet-400"
                  >
                    <option value="sunny">Sunny</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rainy">Rainy</option>
                    <option value="partly_cloudy">Partly Cloudy</option>
                    <option value="snowy">Snowy</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="textReview" className="block text-gray-700 font-medium mb-2">Your Review</label>
                  <textarea
                    id="textReview"
                    name="textReview"
                    placeholder="Share your experience with this location..."
                    value={formData.textReview}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-quiet-400"
                  />
                  {validationErrors.textReview && <p className="text-red-500 text-sm mt-1">{validationErrors.textReview}</p>}
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-quiet-400 hover:bg-quiet-500 text-white px-4 py-2 rounded w-full font-medium"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
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

export default SubmitReview;
