
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LocationCategory } from '@/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  maxNoise: number;
  type: string;
  isOpenNow: boolean;
}

const MapFilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    maxNoise: 100,
    type: 'all',
    isOpenNow: false,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden transition-all">
      <div className="p-3 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter size={18} />
          <span>Filters</span>
        </Button>
        
        {isExpanded && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(false)}
          >
            <X size={18} />
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="noise-level">Max Noise Level: {filters.maxNoise}%</Label>
            <Slider
              id="noise-level"
              value={[filters.maxNoise]}
              min={0}
              max={100}
              step={10}
              onValueChange={(values) => handleFilterChange('maxNoise', values[0])}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="space-type">Type of Space</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger id="space-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Spaces</SelectItem>
                <SelectItem value="library">Library</SelectItem>
                <SelectItem value="study room">Study Room</SelectItem>
                <SelectItem value="café">Café</SelectItem>
                <SelectItem value="outdoor space">Outdoor Space</SelectItem>
                <SelectItem value="lounge">Lounge</SelectItem>
                <SelectItem value="classroom">Classroom</SelectItem>
                <SelectItem value="garden">Garden</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="open-now" className="cursor-pointer">Open Now</Label>
            <Switch
              id="open-now"
              checked={filters.isOpenNow}
              onCheckedChange={(checked) => handleFilterChange('isOpenNow', checked)}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              const resetFilters = {
                maxNoise: 100,
                type: 'all',
                isOpenNow: false,
              };
              setFilters(resetFilters);
              onFilterChange(resetFilters);
            }}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MapFilterBar;
