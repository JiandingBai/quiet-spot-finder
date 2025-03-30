
import { cn } from "@/lib/utils";

interface QuietnessMeterProps {
  level: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const QuietnessMeter = ({ 
  level, 
  showLabel = true,
  size = "md",
  className 
}: QuietnessMeterProps) => {
  // Ensure level is between 1-5
  const quietnessLevel = Math.max(1, Math.min(5, Math.round(level)));
  
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };
  
  const getLabel = () => {
    if (level >= 4) return "Very Quiet";
    if (level >= 3) return "Quiet";
    if (level >= 2) return "Moderate";
    return "Noisy";
  };
  
  const getBarColor = () => {
    if (level >= 4) return "bg-green-500";
    if (level >= 2.5) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex w-full items-center gap-2">
        <div className={cn("rounded-full flex-1", sizeClasses[size], getBarColor())}></div>
        {showLabel && (
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {getLabel()} ({level.toFixed(1)})
          </span>
        )}
      </div>
    </div>
  );
};

export default QuietnessMeter;
