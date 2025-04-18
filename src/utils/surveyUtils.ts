import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSurvey, patchSurveyAnswer} from '../api/api';
import axios from 'axios';

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
export const getOrCreateSurvey = async (): Promise<number> => {
  const existingId = await AsyncStorage.getItem('survey_id');
  if (existingId) {
    console.log('📦 기존 survey_id 사용:', existingId);
    return Number(existingId);
  }

  try {
    const newId = await createSurvey();
    await setSurveyId(newId);
    console.log('✅ 새로 생성된 survey_id:', newId);
    return newId;
  } catch (error: any) {
    // 설문이 이미 존재할 경우
    if (
      axios.isAxiosError(error) &&
      error.response?.data?.message === '이미 설문이 존재합니다.'
    ) {
      console.warn('⚠️ 이미 설문이 존재함 → 기존 ID를 불러옵니다.');

      const existingIdFromError = error.response?.data?.data?.id;

      if (existingIdFromError) {
        await setSurveyId(existingIdFromError);
        console.log('✅ 에러 응답에서 추출한 survey_id:', existingIdFromError);
        return existingIdFromError;
      }

      // ID가 없으면 초기화 후 재생성
      await resetSurveyState();
      const newId = 3;
      await setSurveyId(newId);
      console.log('✅ 초기화 후 재생성된 survey_id:', newId);
      return newId;
    }

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
