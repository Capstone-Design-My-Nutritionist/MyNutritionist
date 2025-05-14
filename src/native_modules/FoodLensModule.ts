import { NativeModules } from 'react-native';

const { FoodLensModule } = NativeModules;

interface NutritionInfo {
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  sodium: number;
  sugar: number;
}

interface Nutrition {
  energy: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  sodium: number;
  totalSugars: number;
  cholesterol: number;
  totalDietaryFiber: number;
  calcium: number;
  saturatedFattyAcid: number;
  transFattyAcid: number;
  vitaminA: number;
  vitaminB6: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  [key: string]: number;
}

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FoodItem {
  name: string;
  confidence: number;
  foodId?: string;
  foodType?: number;
  nutritionInfo?: NutritionInfo;
  position?: Position;
}

interface RecognitionResult {
  foods: FoodItem[];
}

/**
 * FoodLens SDK를 통해 이미지를 분석하고 음식 정보를 반환합니다.
 * @param imageUri - 분석할 이미지의 URI (file:// 또는 content:// URI)
 * @returns 음식 인식 결과
 */
export function predictImage(imageUri: string): Promise<RecognitionResult> {
  if (!imageUri) {
    return Promise.reject(new Error('Image URI is required'));
  }
  
  return FoodLensModule.predictImage(imageUri);
}



export default {
  predictImage,
};
