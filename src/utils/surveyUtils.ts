import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 설문조사 상태를 초기화하는 함수
 * AsyncStorage에 저장된 모든 설문 관련 데이터를 삭제합니다.
 */
export const resetSurveyState = async (): Promise<void> => {
  try {
    // 설문 관련 키 목록 (필요에 따라 추가)
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
    ];

    // 모든 설문 관련 키 삭제
    const promises = surveyKeys.map(key => AsyncStorage.removeItem(key));
    await Promise.all(promises);
    
    console.log('설문조사 상태가 초기화되었습니다.');
  } catch (error) {
    console.error('설문조사 상태 초기화 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 설문조사 완료 시간을 저장하는 함수
 */
export const saveSurveyCompletionTime = async (): Promise<void> => {
  try {
    const currentDate = new Date().toISOString();
    await AsyncStorage.setItem('survey_last_completed', currentDate);
  } catch (error) {
    console.error('설문조사 완료 시간 저장 중 오류 발생:', error);
  }
};

/**
 * 마지막 설문조사 완료 시간을 가져오는 함수
 * @returns {Promise<string | null>} 마지막 설문조사 완료 시간 (ISO 문자열) 또는 null
 */
export const getLastSurveyCompletionTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('survey_last_completed');
  } catch (error) {
    console.error('마지막 설문조사 완료 시간 조회 중 오류 발생:', error);
    return null;
  }
};
