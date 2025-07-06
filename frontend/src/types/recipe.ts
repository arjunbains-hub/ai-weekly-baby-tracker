// Recipe Creator Types

export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
  category?: string;
}

export interface SeasoningProfile {
  id: string;
  name: string;
  description: string;
  seasonings: string[];
  cuisine: string;
  spiceLevel: 'mild' | 'medium' | 'hot';
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeRequest {
  ingredients: Ingredient[];
  cuisine?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: 'quick' | 'medium' | 'slow';
  calorieRange?: 'low' | 'medium' | 'high';
  dietaryRestrictions?: string[];
  seasoningProfileId?: string;
  servings?: number;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  perServing: boolean;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  time?: string;
  tips?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: RecipeStep[];
  nutrition: NutritionalInfo;
  cuisine: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cookingTime: string;
  servings: number;
  prepTime: string;
  totalTime: string;
  tips: string[];
  substitutions?: Record<string, string[]>;
  imageUrl?: string;
  rating?: number;
  createdAt: Date;
}

export interface RecipeResponse {
  recipes: Recipe[];
  agent_type: string;
  route_taken: string;
  result: string;
  seasoning_suggestions?: string[];
  missing_ingredients?: string[];
  shopping_list?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  seasoningProfiles: SeasoningProfile[];
  savedRecipes: string[];
  cookingHistory: {
    recipeId: string;
    cookedAt: Date;
    rating?: number;
    notes?: string;
  }[];
  preferences: {
    preferredCuisines: string[];
    dietaryRestrictions: string[];
    spiceLevel: 'mild' | 'medium' | 'hot';
    calorieGoal?: number;
  };
}

export interface CuisineInfo {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  typicalCookingTime: string;
  keyIngredients: string[];
  cookingTechniques: string[];
  culturalContext: string;
}
