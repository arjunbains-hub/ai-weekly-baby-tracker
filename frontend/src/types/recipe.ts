// Weekend Baby Explorer Types

export interface ChildInfo {
  ageYears: number;
  ageMonths: number;
}

export interface UserProfile {
  id: string;
  children: ChildInfo[];
  postcode: string;
  maxTravelTime: number; // in minutes
  transportMode: 'car' | 'public' | 'walking' | 'cycling';
  budget: number; // in GBP
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  createdAt: string;
}

export interface UserProfileCreate {
  children: ChildInfo[];
  postcode: string;
  maxTravelTime: number;
  transportMode: 'car' | 'public' | 'walking' | 'cycling';
  budget: number;
  startTime: string;
  endTime: string;
}

export interface ActivityPreferences {
  likedActivities: string[];
  dislikedActivities: string[];
  eatOut: boolean;
  foodStyle?: string;
  restaurantRequirements?: string;
}

export interface WeekendRequest {
  userId: string;
  children: ChildInfo[];
  postcode: string;
  maxTravelTime: number;
  transportMode: 'car' | 'public' | 'walking' | 'cycling';
  budget: number;
  startTime: string;
  endTime: string;
  activityPreferences: ActivityPreferences;
}

export interface ActivityStop {
  name: string;
  category: string; // "park", "cafe", "museum", "home", etc.
  time: string;     // "10:30-12:00"
  cost: number;
  note: string;
  location?: string;
  bookingUrl?: string;
  travelTime: number; // in minutes
  timeBreakdown: string; // detailed breakdown of activities
  topTips: string[];
  pros: string[];
  cons: string[];
  // New fields for step-by-step itinerary
  arrivalTime: string;
  departureTime: string;
  duration: number; // in minutes
  transportDetails?: {
    mode: string;
    duration: number;
    instructions: string;
  };
}

export interface WeekendPlan {
  type: string; // "with_baby" or "parent_recharge"
  title: string;
  stops: ActivityStop[];
  mapImg?: string;
  totalCost: number;
  totalDuration: string;
  totalTravelTime: number;
  estimatedSpend: number;
}

export interface WeekendResponse {
  plans: WeekendPlan[];
  generationMs: number;
  weatherSummary: string;
}

// Legacy types for backward compatibility (can be removed later)
export interface BabyProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  sleepSetup: string;
  sleepLocation: string;
  sleepChallenges: string;
  additionalNotes: string;
}

export interface WeeklySleepCheckIn {
  babyId: string;
  weekNumber: number;
  sleepPattern: string;
  changesTried: string;
  biggestChallenge: string;
  parentNotes?: string;
}

export interface SleepSummary {
  id: string;
  babyId: string;
  weekNumber: number;
  sleepSummary: string;
  sleepRating: string;
  sleepPlan: string[];
  sources: string[];
  createdAt: string;
}

export interface BabySleepResponse {
  summary: SleepSummary;
  babyAgeWeeks: number;
}
