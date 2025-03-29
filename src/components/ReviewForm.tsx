
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
import { Location, TimeOfDay } from "@/types";
import { useNavigate } from "react-router-dom";
import { addReview } from "@/services/locationService";
import { getCurrentUser, setNickname } from "@/services/userService";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  locationId: z.string().min(1, "Please select a location"),
  nickname: z.string().min(2, "Nickname must be at least 2 characters"),
  quietnessRating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment must be less than 500 characters"),
  visitDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]),
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
    locationId: preselectedLocationId || "",
    nickname: currentUser?.nickname || "",
    quietnessRating: 3,
    comment: "",
    visitDate: new Date().toISOString().split('T')[0],
    timeOfDay: "afternoon",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save the nickname if it's different
      if (!currentUser || currentUser.nickname !== data.nickname) {
        setNickname(data.nickname);
      }
      
      // Submit the review
      const review = await addReview({
        locationId: data.locationId,
        nickname: data.nickname,
        quietnessRating: data.quietnessRating,
        comment: data.comment,
        visitDate: data.visitDate,
        timeOfDay: data.timeOfDay as TimeOfDay,
      });
      
      toast.success("Review submitted successfully!");
      
      // Navigate to the location details page
      navigate(`/location/${data.locationId}`);
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!currentUser && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nickname Required</AlertTitle>
            <AlertDescription>
              You need to provide a nickname before submitting a review. This will be visible to others.
            </AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="locationId"
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
                    <SelectValue placeholder="Select a quiet space" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location._id} value={location._id}>
                      {location.name}
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
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Nickname</FormLabel>
              <FormControl>
                <Input placeholder="StudyMaster" {...field} />
              </FormControl>
              <FormDescription>
                This will be visible with your review
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quietnessRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quietness Rating (1-5)</FormLabel>
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
                1 = Very noisy, 5 = Very quiet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="visitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visit Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeOfDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Day</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time of day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this quiet space..."
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
