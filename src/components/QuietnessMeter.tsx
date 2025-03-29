
import { cn } from "@/lib/utils";
import { QuietnessLevel } from "@/types";

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
  const quietnessLevel = Math.max(1, Math.min(5, Math.round(level))) as QuietnessLevel;
  
  const sizeClasses = {
    sm: "h-1 gap-1",
    md: "h-2 gap-1.5",
    lg: "h-3 gap-2",
  };
  
  const getLabel = () => {
    switch(quietnessLevel) {
      case 1: return "Very Noisy";
      case 2: return "Noisy";
      case 3: return "Moderate";
      case 4: return "Quiet";
      case 5: return "Very Quiet";
    }
  };
  
  const getBars = () => {
    const bars = [];
    for (let i = 1; i <= 5; i++) {
      bars.push(
        <div 
          key={i}
          className={cn(
            "rounded-full flex-1 transition-colors",
            i <= quietnessLevel 
              ? getBarColor(i) 
              : "bg-gray-200"
          )}
        />
      );
    }
    return bars;
  };
  
  const getBarColor = (barLevel: number) => {
    switch(barLevel) {
      case 1: return "bg-red-400";
      case 2: return "bg-orange-400";
      case 3: return "bg-yellow-400";
      case 4: return "bg-green-400";
      case 5: return "bg-quiet-400";
    }
  };
  
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("flex w-full", sizeClasses[size])}>
        {getBars()}
      </div>
      
      {showLabel && (
        <span className="text-xs text-gray-600 mt-1">
          {getLabel()}
        </span>
      )}
    </div>
  );
};

export default QuietnessMeter;
