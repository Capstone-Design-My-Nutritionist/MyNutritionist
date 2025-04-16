import AsyncStorage from '@react-native-async-storage/async-storage';
import {patchSurveyAnswer} from '../api/api';

export const setSurveyId = async (id: number): Promise<void> => {
  await AsyncStorage.setItem('survey_id', String(id));
};

export const getSurveyId = async (): Promise<number> => {
  const id = await AsyncStorage.getItem('survey_id');
  if (!id) throw new Error('❌ surveyId가 존재하지 않습니다.');
  return Number(id);
};

export const submitSurveyAnswer = async (
  field: string,
  value: any,
  surveyIdOverride?: number,
): Promise<void> => {
  const id = surveyIdOverride ?? (await getSurveyId());

  console.log('📤 [submitSurveyAnswer] 전달 값:', {
    surveyId: id,
    field,
    value,
  });

  try {
    await patchSurveyAnswer(id, field, value);
    console.log(`✅ ${field} 저장 완료`);
  } catch (e) {
    console.error('❌ patchSurveyAnswer 실패:', e);
  }
};

/**
 * 설문 상태 초기화
 */
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
      'survey_id', // 이 라인도 추가!
    ];

    const promises = surveyKeys.map(key => AsyncStorage.removeItem(key));
    await Promise.all(promises);
    console.log('설문조사 상태 초기화 완료');
  } catch (error) {
    console.error('설문조사 초기화 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 마지막 설문 완료 시간 저장
 */
export const saveSurveyCompletionTime = async (): Promise<void> => {
  try {
    const currentDate = new Date().toISOString();
    await AsyncStorage.setItem('survey_last_completed', currentDate);
  } catch (error) {
    console.error('설문 완료 시간 저장 실패:', error);
  }
};

/**
 * 마지막 설문 완료 시간 조회
 */
export const getLastSurveyCompletionTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('survey_last_completed');
  } catch (error) {
    console.error('마지막 완료 시간 조회 실패:', error);
    return null;
  }
};
