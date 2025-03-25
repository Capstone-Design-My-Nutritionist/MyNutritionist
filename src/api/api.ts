import axios, {AxiosError} from 'axios';
import {API_URL} from '../utils/env';

export const API_ENDPOINTS = {
  //이 부분은 나중에 백엔드랑 연동할 때 수정 - endpoint 잘보기
  GET_SUPPLEMENTS: `${API_URL}/supplements`,
  GET_FOOD_HISTORY: `${API_URL}/food-history`,
  GET_PROGRESSBAR: `${API_URL}/progress-bar`,
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
