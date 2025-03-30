
export interface Location {
  _id: string;
  address: string;
  longitude: number;
  latitude: number;
  rating: number;
  numReviews: number;
  name?: string; 
  description?: string;
  category?: string;
  amenities?: string[];
  imageUrl?: string;
}

export interface Review {
  _id: string;
  name: string;
  textReview: string;
  noiseLevel: number;
  busyLevel: number;
  location: string; // LocationId
  weather: "rainy" | "cloudy" | "sunny" | "partly_cloudy" | "snowy";
  datetime: string;
}

export interface User {
  nickname: string;
}

export type QuietnessLevel = 1 | 2 | 3 | 4 | 5;

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type LocationCategory = 
  | 'library' 
  | 'study room' 
  | 'café' 
  | 'outdoor space' 
  | 'lounge' 
  | 'classroom'
  | 'garden'
  | 'other';
