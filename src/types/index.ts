
export interface Location {
  _id: string;
  name: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  category: string;
  amenities: string[];
  averageQuietness: number;
  reviews: Review[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  locationId: string;
  nickname: string;
  quietnessRating: number;
  comment: string;
  visitDate: string;
  timeOfDay: string;
  createdAt: string;
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
