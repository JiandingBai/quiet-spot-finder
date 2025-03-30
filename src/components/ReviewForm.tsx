
import { useState } from "react";
import { Location } from "@/types";
import { useNavigate } from "react-router-dom";
import { addReview } from "@/services/locationService";
import { getCurrentUser, setNickname } from "@/services/userService";

interface ReviewFormProps {
  locations: Location[];
  preselectedLocationId?: string;
}

const ReviewForm = ({ locations, preselectedLocationId }: ReviewFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = getCurrentUser();
  
  const [formData, setFormData] = useState({
    location: preselectedLocationId || "",
    name: currentUser?.nickname || "",
    noiseLevel: 3,
    busyLevel: 3,
    textReview: "",
    weather: "sunny" as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.location) newErrors.location = "Please select a location";
    if (!formData.name || formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!formData.textReview || formData.textReview.length < 10) newErrors.textReview = "Review must be at least 10 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      // Save the nickname if it's different
      if (!currentUser || currentUser.nickname !== formData.name) {
        setNickname(formData.name);
      }
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Select Location</label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          disabled={isSubmitting || !!preselectedLocationId}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-quiet-400"
        >
          <option value="">Select a location</option>
          {locations.map((location) => (
            <option key={location._id} value={location._id}>
              {location.name || location.address}
            </option>
          ))}
        </select>
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
        <p className="text-gray-500 text-sm mt-1">This will be visible with your review</p>
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
        <p className="text-gray-500 text-sm mt-1">Provide details about your experience</p>
        {errors.textReview && <p className="text-red-500 text-sm mt-1">{errors.textReview}</p>}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-quiet-400 hover:bg-quiet-500 text-white px-4 py-2 rounded w-full font-medium"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
