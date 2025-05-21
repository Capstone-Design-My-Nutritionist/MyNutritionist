import axios from 'axios';
import {API_URL} from '../utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const API_ENDPOINTS = {
  GET_SUPPLEMENTS: `${API_URL}/supplements`,
  GET_FOOD_HISTORY: `${API_URL}/food-history`,
  GET_PROGRESSBAR: `${API_URL}/progress-bar`,
  CREATE_SURVEY: `${API_URL}/surveys`,
  POST_MEALS: `${API_URL}/meals`,
  DELETE_MEALS: `${API_URL}/meals`,
  GET_MEAL_RECORDS: `${API_URL}/meal-records`,
  GET_MEAL_BY_TYPE: `${API_URL}/meals`,
  GET_NUTRITION_SUMMARY: `${API_URL}/meals/nutrition/summary`,
  GET_USER_INFO: `${API_URL}/users/me`,
};

// ------------------------
// ✅ 영양제 추천 API
// ------------------------
export const fetchSupplements = async () => {
  try {
    console.log('API 요청:', API_ENDPOINTS.GET_SUPPLEMENTS);
    const response = await axios.get(API_ENDPOINTS.GET_SUPPLEMENTS);
    console.log('API 응답:', response.data);
    if (!response.data || !Array.isArray(response.data.data)) {
      console.error('서버에서 배열이 아닌 응답을 반환했습니다:', response.data);
      return [];
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios 네트워크 에러:', error.message);
    } else {
      console.error('알 수 없는 오류 발생:', error);
    }
    return [];
  }
};

// ------------------------
// ✅ 음식 기록 조회 API
// ------------------------
export const fetchFoodHistory = async () => {
  try {
    console.log('API 요청:', API_ENDPOINTS.GET_FOOD_HISTORY);
    const response = await axios.get(API_ENDPOINTS.GET_FOOD_HISTORY);
    console.log('API 응답:', response.data);
    if (!response.data || !Array.isArray(response.data.data)) {
      console.error('서버에서 배열이 아닌 응답을 반환했습니다:', response.data);
      return [];
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios 네트워크 에러:', error.message);
    } else {
      console.error('알 수 없는 오류 발생:', error);
    }
    return [];
  }
};

// ------------------------
// ✅ 프로그레스바 데이터 API
// ------------------------
export const fetchProgressBar = async () => {
  try {
    console.log('API 요청:', API_ENDPOINTS.GET_PROGRESSBAR);
    const response = await axios.get(API_ENDPOINTS.GET_PROGRESSBAR);
    console.log('API 응답:', response.data);
    if (!response.data || !Array.isArray(response.data.data)) {
      console.error('서버에서 배열이 아닌 응답을 반환했습니다:', response.data);
      return [];
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios 네트워크 에러:', error.message);
    } else {
      console.error('알 수 없는 오류 발생:', error);
    }
    return [];
  }
};

// ------------------------
// ✅ 설문 생성 API
// ------------------------
export const createSurvey = async (): Promise<number> => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('🪪 토큰:', token);

  try {
    const response = await axios.post(
      `${API_URL}/surveys`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('📦 설문 생성 응답:', response.data);
    const surveyId = response.data?.data?.id ?? response.data?.data;
    if (!surveyId) throw new Error('❌ surveyId 없음');
    return surveyId;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ createSurvey AxiosError:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unknown error:', String(error));
    }
    throw error;
  }
};

// ------------------------
// ✅ 설문 항목 저장 API
// ------------------------
export const patchSurveyAnswer = async (
  surveyId: number,
  field: string,
  value: any,
) => {
  const token = await AsyncStorage.getItem('accessToken');

  let url = `${API_URL}/surveys/${surveyId}/${field}`;
  let body = {[field]: value};

  // medication-status
  if (field === 'medication-status') {
    url = `${API_URL}/surveys/${surveyId}/medication-status`;
    body = value; // { takingMedication: true }
  }

  // medications
  if (field === 'medications') {
    url = `${API_URL}/surveys/${surveyId}/medications`;
    body = value; // { medications: [...] }
  }

  // supplement-status
  if (field === 'supplement-status') {
    url = `${API_URL}/surveys/${surveyId}/supplement-status`;
    body = value; // { takingSupplements: true }
  }

  // supplements
  if (field === 'supplements') {
    url = `${API_URL}/surveys/${surveyId}/supplements`;
    body = value; // { supplements: [...] }
  }

  // diagnosed-disease-status
  if (field === 'diagnosed-disease-status') {
    url = `${API_URL}/surveys/${surveyId}/diagnosed-disease-status`;
    body = value; // { hasDiagnosedDisease: true/false }
  }

  // diseases
  if (field === 'diseases') {
    url = `${API_URL}/surveys/${surveyId}/diseases`;
    body = value; // { diseases: [...] }
  }

  // family-history-status
  if (field === 'family-history-status') {
    url = `${API_URL}/surveys/${surveyId}/family-history-status`;
    body = value; // { hasFamilyHistory: true }
  }

  // family-histories
  if (field === 'family-histories') {
    url = `${API_URL}/surveys/${surveyId}/family-histories`;
    body = value; // { familyDiseases: [...] }
  }

  // concerns
  if (field === 'concerns') {
    url = `${API_URL}/surveys/${surveyId}/concerns`;
    body = value; // { concerns: [...] }
  }

  // goals
  if (field === 'goals') {
    url = `${API_URL}/surveys/${surveyId}/goals`;
    body = value; // { goals: [...] }
  }

  // sleepTime
  if (field === 'sleepTime') {
    url = `${API_URL}/surveys/${surveyId}/sleep-time`;
    body = value; // { sleepTime: 'UNDER_5_HOURS' }
  }

  // exerciseFrequency
  if (field === 'exerciseFrequency') {
    url = `${API_URL}/surveys/${surveyId}/exercise-frequency`;
    body = value; // { exerciseFrequency: 'NONE' }
  }

  // meal-count
  if (field === 'meal-count') {
    url = `${API_URL}/surveys/${surveyId}/meal-count`;
    body = value; // { mealCount: number }
  }

  // vegetable-fruit-intake
  if (field === 'vegetable-fruit-intake') {
    url = `${API_URL}/surveys/${surveyId}/vegetable-fruit-intake`;
    body = value; // { vegetableFruitIntake: 'RARELY' | 'SOMETIMES' | 'DAILY' }
  }

  // water-intake
  if (field === 'water-intake') {
    url = `${API_URL}/surveys/${surveyId}/water-intake`;
    body = value; // { waterIntake: 'UNDER_1L' | 'ONE_TO_TWO_L' | 'OVER_2L' }
  }

  // drinking
  if (field === 'drinking') {
    url = `${API_URL}/surveys/${surveyId}/drinking`;
    body = value; // { drinking: 'NEVER' | 'SOMETIMES' | 'ONE_TWO_WEEKLY' | 'THREE_MORE_WEEKLY' }
  }

  // smoking
  if (field === 'smoking') {
    url = `${API_URL}/surveys/${surveyId}/smoking`;
    body = value; // { smoking: 'NON_SMOKER' | 'PAST_SMOKER' | 'CURRENT_SMOKER' }
  }

  // allergy-status
  if (field === 'allergy-status') {
    url = `${API_URL}/surveys/${surveyId}/allergy-status`;
    body = value; // { hasAllergy: true }
  }

  // allergy-status
  if (field === 'allergies') {
    url = `${API_URL}/surveys/${surveyId}/allergies`;
    body = value; // { allergies: 'NUTS' }
  }

  console.log('📡 PATCH 요청 정보:', {
    url,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const response = await axios.patch(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const completeSurvey = async (surveyId: number) => {
  const token = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      `${API_URL}/surveys/${surveyId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('📦 설문 완료 응답:', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ completeSurvey AxiosError:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unknown error:', String(error));
    }
    throw error;
  }
};

/**
 * 이미지 파일을 Base64 문자열로 변환하는 함수
 * @param uri 이미지 파일의 URI
 * @returns Base64로 인코딩된 이미지 문자열
 */
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    // 파일 경로 정규화
    const filePath = Platform.OS === 'android' && !uri.startsWith('file://')
      ? `file://${uri}`
      : uri;
    
    // 파일을 Base64로 읽기
    const base64Image = await RNFS.readFile(filePath, 'base64');
    return base64Image;
  } catch (error) {
    console.error('이미지 Base64 변환 오류:', error);
    throw new Error('이미지를 변환하는 중 오류가 발생했습니다.');
  }
};

// ------------------------
// ✅ 식사 기록 조회 API
// ------------------------

/**
 * 특정 날짜의 식사 기록을 조회하는 함수
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns 서버 응답 데이터
 */
export const fetchMealRecords = async (date: string) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    console.log('식사 기록 조회 API 요청:', `${API_ENDPOINTS.GET_MEAL_RECORDS}?date=${date}`);
    
    const response = await axios.get(`${API_ENDPOINTS.GET_MEAL_RECORDS}?date=${date}`, {
      headers,
    });
    
    console.log('식사 기록 조회 API 응답:', response.data);
    
    if (!response.data || !response.data.data) {
      console.warn('서버에서 유효한 응답을 반환하지 않았습니다:', response.data);
      return null;
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('식사 기록 조회 중 네트워크 에러:', error.message);
      console.error('에러 상세:', error.response?.data);
    } else {
      console.error('식사 기록 조회 중 오류 발생:', error);
    }
    throw error;
  }
};

/**
 * 특정 식사 유형의 음식 정보를 조회하는 함수
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @param mealType 식사 유형 (BREAKFAST, LUNCH, DINNER, SNACK 중 하나)
 * @returns 서버 응답 데이터
 */
export const fetchMealByType = async (date: string, mealType: string) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    // mealType이 유효한지 확인
    const validMealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
    if (!validMealTypes.includes(mealType)) {
      console.warn('유효하지 않은 식사 유형:', mealType);
      throw new Error(`유효하지 않은 식사 유형: ${mealType}. 유효한 값: ${validMealTypes.join(', ')}`);
    }
    
    console.log('식사 유형별 음식 정보 조회 API 요청:', `${API_ENDPOINTS.GET_MEAL_BY_TYPE}/${mealType}?date=${date}`);
    
    const response = await axios.get(`${API_ENDPOINTS.GET_MEAL_BY_TYPE}/${mealType}`, {
      params: { date },
      headers,
    });
    
    console.log('식사 유형별 음식 정보 조회 API 응답:', response.data);
    
    if (!response.data || !response.data.data) {
      console.warn('서버에서 유효한 응답을 반환하지 않았습니다:', response.data);
      return null;
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('식사 유형별 음식 정보 조회 중 네트워크 에러:', error.message);
      console.error('에러 상세:', error.response?.data);
    } else {
      console.error('식사 유형별 음식 정보 조회 중 오류 발생:', error);
    }
    throw error;
  }
};

/**
 * 음식 데이터를 서버에 제출하는 함수
 * @param mealType 식사 유형 (BREAKFAST, LUNCH, DINNER, SNACK)
 * @param imageUri 음식 이미지 URI
 * @param foods 음식 데이터 배열
 * @returns 서버 응답 데이터
 */
export const postMealData = async (
  mealType: string,
  imageUri: string,
  foods: Array<{
    name: string;
    fullName?: string;
    eatAmount: number;
    nutrition: Record<string, number>;
    combinedFoodNames?: string; // 추가: '|' 구분자로 연결된 음식 이름 문자열
  }>,
) => {
  const token = await AsyncStorage.getItem('accessToken');
  
  try {
    // 이미지를 Base64로 변환
    const base64Image = await convertImageToBase64(imageUri);
    
    // FormData 생성
    const formData = new FormData();
    
    // 이미지 추가
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food_image.jpg',
    } as any);
    
    // 음식 데이터 JSON 생성 - mealType을 포함하여 서버에 전송
    const foodData = {
      foods: foods.map(food => ({
        name: food.name,
        fullName: food.fullName || food.name,
        eatAmount: food.eatAmount,
        nutrition: food.nutrition,
        combinedFoodNames: food.combinedFoodNames || food.name, // combinedFoodNames 필드 추가
      })),
      mealType: mealType, // 식사 유형을 JSON 데이터 내부에 포함
    };
    
    // 음식 데이터 추가
    formData.append('request', JSON.stringify(foodData));
    
    // 식사 유형을 별도 파라미터로도 추가 (이중 보호)
    formData.append('mealType', mealType);
    
    console.log('🔔 음식 데이터 제출:', {
      mealType,
      foodsCount: foods.length,
    });
    
    // API 호출
    const response = await axios.post(API_ENDPOINTS.POST_MEALS, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('📦 음식 데이터 제출 응답:', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ postMealData AxiosError:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unknown error:', String(error));
    }
    throw error;
  }
};

/**
 * 유저 정보를 가져오는 함수
 * @returns 현재 로그인한 유저의 정보
 */
export const fetchUserInfo = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  
  try {
    console.log('🔔 유저 정보 요청');
    
    // API 호출
    const response = await axios.get(API_ENDPOINTS.GET_USER_INFO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('📦 유저 정보 응답:', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ fetchUserInfo AxiosError:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unknown error:', String(error));
    }
    throw error;
  }
};

/**
 * 영양소 요약 데이터를 가져오는 함수
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns 해당 날짜의 영양소 요약 데이터
 */
export const fetchNutritionSummary = async (date: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  
  try {
    // API 호출 URL
    const url = `${API_ENDPOINTS.GET_NUTRITION_SUMMARY}?date=${date}`;
    
    console.log('🔔 영양소 요약 데이터 요청:', url);
    
    // API 호출
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('📦 영양소 요약 데이터 응답:', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ fetchNutritionSummary AxiosError:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unknown error:', String(error));
    }
    throw error;
  }
};

/**
 * 음식 데이터를 삭제하는 함수
 * @param date 삭제할 음식의 날짜 (YYYY-MM-DD 형식)
 * @param mealType 식사 유형 (BREAKFAST, LUNCH, DINNER, SNACK)
 * @param foodName 삭제할 음식 이름
 * @returns 서버 응답 데이터
 */
export const deleteMeal = async (
  date: string,
  mealType: string,
  foodName: string,
) => {
  const token = await AsyncStorage.getItem('accessToken');
  
  try {
    // mealType이 유효한지 확인
    const validMealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
    if (!validMealTypes.includes(mealType)) {
      console.warn('유효하지 않은 식사 유형:', mealType);
      throw new Error(`유효하지 않은 식사 유형: ${mealType}. 유효한 값: ${validMealTypes.join(', ')}`);
    }
    
    // 쿼리 파라미터 구성
    const params = {
      date,
      mealType,
      foodName,
    };
    
    console.log('🗑️ 음식 데이터 삭제 요청:', params);
    
    // API 호출
    const response = await axios.delete(API_ENDPOINTS.DELETE_MEALS, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ 음식 데이터 삭제 성공:', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ deleteMeal AxiosError:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unknown error:', String(error));
    }
    throw error;
  }
};
