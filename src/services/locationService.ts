
import { Location, Review } from '@/types';

// Since we're not using actual MongoDB connection here, we'll create mock data
// In a real app, this would be API calls to your MongoDB backend
const MOCK_LOCATIONS: Location[] = [
  {
    _id: '1',
    name: 'Irving K. Barber Learning Centre',
    description: 'A large library with multiple floors of quiet study spaces.',
    location: {
      type: 'Point',
      coordinates: [-123.2526, 49.2680] // [longitude, latitude]
    },
    address: '1961 East Mall, Vancouver, BC V6T 1Z1',
    category: 'library',
    amenities: ['wifi', 'desks', 'power outlets', 'study rooms'],
    averageQuietness: 4.5,
    reviews: [],
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Koerner Library',
    description: 'Quiet library with individual study carrels and group study rooms.',
    location: {
      type: 'Point',
      coordinates: [-123.2555, 49.2694]
    },
    address: '1958 Main Mall, Vancouver, BC V6T 1Z2',
    category: 'library',
    amenities: ['wifi', 'desks', 'power outlets', 'study rooms', 'computers'],
    averageQuietness: 4.8,
    reviews: [],
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Nitobe Memorial Garden',
    description: 'A traditional Japanese garden perfect for quiet reflection.',
    location: {
      type: 'Point',
      coordinates: [-123.2595, 49.2677]
    },
    address: '1895 Lower Mall, Vancouver, BC V6T 1Z4',
    category: 'garden',
    amenities: ['benches', 'nature', 'water features'],
    averageQuietness: 4.9,
    reviews: [],
    imageUrl: 'https://images.unsplash.com/photo-1614128569361-0873767775e0?q=80&w=1000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'The Nest - Upper Floors',
    description: 'Upper floors of the student union building with study spaces.',
    location: {
      type: 'Point',
      coordinates: [-123.2490, 49.2665]
    },
    address: '6133 University Blvd, Vancouver, BC V6T 1Z1',
    category: 'study room',
    amenities: ['wifi', 'desks', 'power outlets', 'food nearby'],
    averageQuietness: 3.2,
    reviews: [],
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    name: 'Woodward Library',
    description: 'A more specialized library with quiet study spaces.',
    location: {
      type: 'Point',
      coordinates: [-123.2468, 49.2641]
    },
    address: '2198 Health Sciences Mall, Vancouver, BC V6T 1Z3',
    category: 'library',
    amenities: ['wifi', 'desks', 'power outlets'],
    averageQuietness: 4.6,
    reviews: [],
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    name: 'Buchanan Building - Courtyards',
    description: 'Peaceful courtyards within the Buchanan building complex.',
    location: {
      type: 'Point',
      coordinates: [-123.2540, 49.2691]
    },
    address: '1866 Main Mall, Vancouver, BC V6T 1Z1',
    category: 'outdoor space',
    amenities: ['benches', 'nature'],
    averageQuietness: 3.9,
    reviews: [],
    imageUrl: 'https://images.unsplash.com/photo-1576009982046-e596d48810e4?q=80&w=1000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock reviews
const MOCK_REVIEWS: Review[] = [
  {
    _id: '101',
    locationId: '1',
    nickname: 'StudiousGrad',
    quietnessRating: 5,
    comment: 'Perfect place to focus on my thesis. 3rd floor is especially quiet.',
    visitDate: '2023-10-15',
    timeOfDay: 'afternoon',
    createdAt: new Date().toISOString()
  },
  {
    _id: '102',
    locationId: '1',
    nickname: 'BookLover22',
    quietnessRating: 4,
    comment: 'Great atmosphere, occasional group discussions can be heard.',
    visitDate: '2023-10-10',
    timeOfDay: 'morning',
    createdAt: new Date().toISOString()
  },
  {
    _id: '103',
    locationId: '2',
    nickname: 'FocusedStudent',
    quietnessRating: 5,
    comment: 'Absolutely silent. Perfect for deep concentration.',
    visitDate: '2023-10-12',
    timeOfDay: 'evening',
    createdAt: new Date().toISOString()
  },
  {
    _id: '104',
    locationId: '3',
    nickname: 'ZenSeeker',
    quietnessRating: 5,
    comment: 'Most peaceful place on campus. The sound of water features is so calming.',
    visitDate: '2023-09-28',
    timeOfDay: 'afternoon',
    createdAt: new Date().toISOString()
  }
];

// Add reviews to locations
MOCK_LOCATIONS.forEach(location => {
  location.reviews = MOCK_REVIEWS.filter(review => review.locationId === location._id);
});

// API functions
export const getLocations = async (): Promise<Location[]> => {
  // In a real app, this would be a fetch call to your API
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_LOCATIONS), 500);
  });
};

export const getLocationById = async (id: string): Promise<Location | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const location = MOCK_LOCATIONS.find(loc => loc._id === id);
      resolve(location);
    }, 300);
  });
};

export const addReview = async (review: Omit<Review, '_id' | 'createdAt'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    _id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would be a POST request to your API
  return new Promise(resolve => {
    setTimeout(() => {
      // Find the location and update it
      const location = MOCK_LOCATIONS.find(loc => loc._id === review.locationId);
      if (location) {
        location.reviews.push(newReview);
        
        // Recalculate average quietness
        const totalRating = location.reviews.reduce((sum, rev) => sum + rev.quietnessRating, 0);
        location.averageQuietness = totalRating / location.reviews.length;
      }
      
      resolve(newReview);
    }, 500);
  });
};
