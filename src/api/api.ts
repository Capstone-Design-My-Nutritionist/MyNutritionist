import axios from 'axios';
import {API_URL} from '../utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_ENDPOINTS = {
  //이 부분은 나중에 백엔드랑 연동할 때 수정 - endpoint 잘보기
  GET_SUPPLEMENTS: `${API_URL}/supplements`,
  GET_FOOD_HISTORY: `${API_URL}/food-history`,
  GET_PROGRESSBAR: `${API_URL}/progress-bar`,
  CREATE_SURVEY: `${API_URL}/surveys`,
};

// 영양제 추천 카드 백엔드 연동 부분
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

// 기록한 음식 사진 및 분석 데이터 백엔드 연동 부분
export const fetchFoodHistory = async () => {
  try {
    console.log('API 요청:', API_ENDPOINTS.GET_FOOD_HISTORY);

    const response = await axios.get(API_ENDPOINTS.GET_FOOD_HISTORY);

    console.log('API 응답:', response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      console.error('서버에서 배열이 아닌 응답을 반환했습니다:', response.data);
      return []; // 빈 배열 반환 (오류 방지)
    }

    return response.data.data;
  } catch (error: unknown) {
    //`instanceof`를 사용하여 `AxiosError` 타입 확인
    if (axios.isAxiosError(error)) {
      console.error('Axios 네트워크 에러:', error.message);
    } else {
      console.error('알 수 없는 오류 발생:', error);
    }
    return []; // 오류 발생 시 빈 배열 반환
  }
};

// 메인화면 상세보기 Progressbar 컴포넌트 데이터
export const fetchProgressBar = async () => {
  try {
    console.log('API 요청:', API_ENDPOINTS.GET_PROGRESSBAR);

    const response = await axios.get(API_ENDPOINTS.GET_PROGRESSBAR);

    console.log('API 응답:', response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      console.error('서버에서 배열이 아닌 응답을 반환했습니다:', response.data);
      return []; // 빈 배열 반환 (오류 방지)
    }

    return response.data.data;
  } catch (error: unknown) {
    //`instanceof`를 사용하여 `AxiosError` 타입 확인
    if (axios.isAxiosError(error)) {
      console.error('Axios 네트워크 에러:', error.message);
    } else {
      console.error('알 수 없는 오류 발생:', error);
    }
    return []; // 오류 발생 시 빈 배열 반환
  }
};

// 설문 생성
export const createSurvey = async (): Promise<number> => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('🪪 토큰:', token);

  try {
    const response = await axios.post(
      `${API_URL}/surveys`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 여기만 수정!
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

// 설문 항목 저장
export const patchSurveyAnswer = async (
  surveyId: number,
  field: string,
  value: any,
) => {
  const token = await AsyncStorage.getItem('accessToken');

  const url = `${API_URL}/surveys/${surveyId}/${field}`;
  const body = {[field]: value};

  console.log('📡 PATCH 요청 정보:', {
    url,
    body,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  });

  const response = await axios.patch(url, body, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
