import { NavigationProp, RouteProp } from '@react-navigation/native';

// Define the RecognitionResult interface based on the structure in FoodLensModule.ts
export interface NutritionInfo {
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  sodium: number;
  sugar: number;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FoodItem {
  name: string;
  confidence: number;
  foodId?: string;
  foodType?: number;
  nutritionInfo?: NutritionInfo;
  nutrition?: Record<string, number>;
  position?: Position;
}

export interface RecognitionResult {
  foods: FoodItem[];
}

// Define the type for your navigation parameters
export type RootStackParamList = {
  Home: undefined;
  Supplements: undefined;
  Upload: undefined;
  Calendar: undefined;
  Profile: undefined;
  FoodUploadScreen: undefined;
  FoodUploadResultScreen: {
    result: RecognitionResult;
    imageUri: string;
  };
  // Add other screens as needed
};

// Export types for useNavigation and useRoute hooks
export type AppNavigationProp = NavigationProp<RootStackParamList>;
export type FoodUploadResultScreenRouteProp = RouteProp<RootStackParamList, 'FoodUploadResultScreen'>;
