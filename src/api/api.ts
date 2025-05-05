import axios from 'axios';
import {API_URL} from '../utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_ENDPOINTS = {
  GET_SUPPLEMENTS: `${API_URL}/supplements`,
  GET_FOOD_HISTORY: `${API_URL}/food-history`,
  GET_PROGRESSBAR: `${API_URL}/progress-bar`,
  CREATE_SURVEY: `${API_URL}/surveys`,
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
