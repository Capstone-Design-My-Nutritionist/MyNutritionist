import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSurvey, patchSurveyAnswer} from '../api/api';
import axios from 'axios';
import {API_URL} from './env';

/** 설문 ID 저장 */
export const setSurveyId = async (id: number): Promise<void> => {
  await AsyncStorage.setItem('survey_id', String(id));
};

/** 설문 ID 불러오기 */
export const getSurveyId = async (): Promise<number> => {
  const id = await AsyncStorage.getItem('survey_id');
  if (!id) throw new Error('❌ surveyId가 존재하지 않습니다.');
  return Number(id);
};

/** 설문 생성 또는 기존 설문 ID 반환 */
// 기존 설문 가져오는 함수
export const fetchExistingSurvey = async (): Promise<number | null> => {
  const token = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(`${API_URL}/surveys`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const surveyData = response.data?.data;
    return surveyData?.id ?? null;
  } catch (error: any) {
    // 💥 여기에서 404가 아니라면 에러 다시 던져야 함
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        console.log('📭 설문 없음 (404), 새로 생성 필요');
        return null;
      } else {
        console.error('❌ 설문 조회 실패 (예상 외):', error.response?.data);
        throw error; // 💥 여기서 throw해야 createSurvey()까지 안 가
      }
    } else {
      throw error;
    }
  }
};

// 설문 생성 또는 기존 설문 ID 사용
export const getOrCreateSurvey = async (): Promise<number> => {
  // 1. AsyncStorage에 있는 경우 우선 사용
  const storedId = await AsyncStorage.getItem('survey_id');
  if (storedId) {
    console.log('📦 저장된 survey_id 사용:', storedId);
    return Number(storedId);
  }

  // 2. 기존 설문 조회
  const existingId = await fetchExistingSurvey();
  if (existingId) {
    await AsyncStorage.setItem('survey_id', String(existingId));
    console.log('📦 조회된 기존 survey_id 사용:', existingId);
    return existingId;
  }

  // 3. 없으면 새로 생성
  try {
    const newId = await createSurvey();
    await AsyncStorage.setItem('survey_id', String(newId));
    console.log('✅ 새로 생성된 survey_id:', newId);
    return newId;
  } catch (error) {
    console.error('❌ 설문 생성 실패:', error);
    throw error;
  }
};

/** 설문 항목 저장 */
export const submitSurveyAnswer = async (
  field: string,
  value: any,
  surveyIdOverride?: number,
): Promise<void> => {
  const id = surveyIdOverride ?? (await getSurveyId());
  await patchSurveyAnswer(id, field, value);
  console.log(`✅ ${field} 저장 완료`);
};

/** 설문 상태 초기화 */
export const resetSurveyState = async (): Promise<void> => {
  try {
    const surveyKeys = [
      'survey_gender',
      'survey_age',
      'survey_height',
      'survey_weight',
      'survey_health_goals',
      'survey_health_concerns',
      'survey_allergy',
      'survey_disease',
      'survey_family_history',
      'survey_medication',
      'survey_supplement',
      'survey_exercise',
      'survey_sleep_time',
      'survey_meal',
      'survey_vegetable',
      'survey_water',
      'survey_smoking',
      'survey_drink',
      'survey_last_completed',
      'survey_id',
    ];

    await Promise.all(surveyKeys.map(key => AsyncStorage.removeItem(key)));
    console.log('🧹 설문 상태 초기화 완료');
  } catch (error) {
    console.error('❌ 설문 상태 초기화 중 오류 발생:', error);
    throw error;
  }
};

/** 마지막 설문 완료 시간 저장 */
export const saveSurveyCompletionTime = async (): Promise<void> => {
  try {
    const currentDate = new Date().toISOString();
    await AsyncStorage.setItem('survey_last_completed', currentDate);
  } catch (error) {
    console.error('설문 완료 시간 저장 실패:', error);
  }
};

/** 마지막 설문 완료 시간 불러오기 */
export const getLastSurveyCompletionTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('survey_last_completed');
  } catch (error) {
    console.error('마지막 완료 시간 조회 실패:', error);
    return null;
  }
};
