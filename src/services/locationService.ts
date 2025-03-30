
import { Location, Review } from '@/types';

// Since we're not using actual MongoDB connection here, we'll create mock data
// In a real app, this would be API calls to your MongoDB backend
const MOCK_LOCATIONS: Location[] = [
  {
    _id: '1',
    name: 'Irving K. Barber Learning Centre',
    description: 'A large library with multiple floors of quiet study spaces.',
    address: '1961 East Mall, Vancouver, BC V6T 1Z1',
    latitude: 49.2680,
    longitude: -123.2526,
    rating: 4.5,
    numReviews: 2,
    category: 'library',
    amenities: ['wifi', 'desks', 'power outlets', 'study rooms'],
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1000',
  },
  {
    _id: '2',
    name: 'Koerner Library',
    description: 'Quiet library with individual study carrels and group study rooms.',
    address: '1958 Main Mall, Vancouver, BC V6T 1Z2',
    latitude: 49.2694,
    longitude: -123.2555,
    rating: 4.8,
    numReviews: 1,
    category: 'library',
    amenities: ['wifi', 'desks', 'power outlets', 'study rooms', 'computers'],
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000',
  },
  {
    _id: '3',
    name: 'Nitobe Memorial Garden',
    description: 'A traditional Japanese garden perfect for quiet reflection.',
    address: '1895 Lower Mall, Vancouver, BC V6T 1Z4',
    latitude: 49.2677,
    longitude: -123.2595,
    rating: 4.9,
    numReviews: 1,
    category: 'garden',
    amenities: ['benches', 'nature', 'water features'],
    imageUrl: 'https://images.unsplash.com/photo-1614128569361-0873767775e0?q=80&w=1000',
  },
  {
    _id: '4',
    name: 'The Nest - Upper Floors',
    description: 'Upper floors of the student union building with study spaces.',
    address: '6133 University Blvd, Vancouver, BC V6T 1Z1',
    latitude: 49.2665,
    longitude: -123.2490,
    rating: 3.2,
    numReviews: 0,
    category: 'study room',
    amenities: ['wifi', 'desks', 'power outlets', 'food nearby'],
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000',
  }
];

// Mock reviews
const MOCK_REVIEWS: Review[] = [
  {
    _id: '101',
    location: '1',
    name: 'StudiousGrad',
    noiseLevel: 5,
    busyLevel: 3,
    textReview: 'Perfect place to focus on my thesis. 3rd floor is especially quiet.',
    weather: 'sunny',
    datetime: new Date().toISOString()
  },
  {
    _id: '102',
    location: '1',
    name: 'BookLover22',
    noiseLevel: 4,
    busyLevel: 2,
    textReview: 'Great atmosphere, occasional group discussions can be heard.',
    weather: 'cloudy',
    datetime: new Date().toISOString()
  },
  {
    _id: '103',
    location: '2',
    name: 'FocusedStudent',
    noiseLevel: 5,
    busyLevel: 4,
    textReview: 'Absolutely silent. Perfect for deep concentration.',
    weather: 'rainy',
    datetime: new Date().toISOString()
  },
  {
    _id: '104',
    location: '3',
    name: 'ZenSeeker',
    noiseLevel: 5,
    busyLevel: 5,
    textReview: 'Most peaceful place on campus. The sound of water features is so calming.',
    weather: 'partly_cloudy',
    datetime: new Date().toISOString()
  }
];

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

export const getReviewsForLocation = async (locationId: string): Promise<Review[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const reviews = MOCK_REVIEWS.filter(review => review.location === locationId);
      resolve(reviews);
    }, 300);
  });
};

export const addReview = async (review: Omit<Review, '_id'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    _id: Math.random().toString(36).substring(2, 9),
  };
  
  // In a real app, this would be a POST request to your API
  return new Promise(resolve => {
    setTimeout(() => {
      // Find the location and update its rating
      const location = MOCK_LOCATIONS.find(loc => loc._id === review.location);
      if (location) {
        // Add the review to our mock database
        MOCK_REVIEWS.push(newReview);
        
        // Update location's rating and numReviews
        const locationReviews = MOCK_REVIEWS.filter(rev => rev.location === location._id);
        const totalRating = locationReviews.reduce((sum, rev) => sum + rev.noiseLevel, 0);
        location.rating = totalRating / locationReviews.length;
        location.numReviews = locationReviews.length;
      }
      
      resolve(newReview);
    }, 500);
  });
};
