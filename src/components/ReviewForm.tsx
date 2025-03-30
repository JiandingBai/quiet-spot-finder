
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Location } from "@/types";
import { useNavigate } from "react-router-dom";
import { addReview } from "@/services/locationService";
import { getCurrentUser, setNickname } from "@/services/userService";

const formSchema = z.object({
  location: z.string().min(1, "Please select a location"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  noiseLevel: z.coerce.number().min(1).max(5),
  busyLevel: z.coerce.number().min(1).max(5),
  textReview: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be less than 500 characters"),
  weather: z.enum(["rainy", "cloudy", "sunny", "partly_cloudy", "snowy"]),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  locations: Location[];
  preselectedLocationId?: string;
}

const ReviewForm = ({ locations, preselectedLocationId }: ReviewFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = getCurrentUser();
  
  const defaultValues: Partial<FormValues> = {
    location: preselectedLocationId || "",
    name: currentUser?.nickname || "",
    noiseLevel: 3,
    busyLevel: 3,
    textReview: "",
    weather: "sunny",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save the nickname if it's different
      if (!currentUser || currentUser.nickname !== data.name) {
        setNickname(data.name);
      }
      
      // Submit the review
      await addReview({
        location: data.location,
        name: data.name,
        noiseLevel: data.noiseLevel,
        busyLevel: data.busyLevel,
        textReview: data.textReview,
        weather: data.weather,
        datetime: new Date().toISOString(),
      });
      
      // Navigate to the location details page
      navigate(`/location/${data.location}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Location</FormLabel>
              <Select
                disabled={isSubmitting || !!preselectedLocationId}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location._id} value={location._id}>
                      {location.name || location.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This will be visible with your review
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="noiseLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Noise Level (1-5)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      {...field}
                      className="w-full"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    <span className="text-lg font-semibold w-8 text-center">
                      {field.value}
                    </span>
                  </div>
                </FormControl>
                <FormDescription>
                  1 = Very loud, 5 = Very quiet
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="busyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Busy Level (1-5)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      {...field}
                      className="w-full"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    <span className="text-lg font-semibold w-8 text-center">
                      {field.value}
                    </span>
                  </div>
                </FormControl>
                <FormDescription>
                  1 = Very busy, 5 = Not busy
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="weather"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weather</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="partly_cloudy">Partly Cloudy</SelectItem>
                  <SelectItem value="snowy">Snowy</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="textReview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this location..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about your experience and tips for others
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-quiet-400 hover:bg-quiet-500 w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
