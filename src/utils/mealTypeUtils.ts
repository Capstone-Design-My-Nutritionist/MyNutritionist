// 백엔드 Enum 값
export const MEAL_TYPE_ENUM = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK'
};

/**
 * 한글 식사 유형을 백엔드 Enum 값으로 변환
 * @param koreanMealType 한글 식사 유형 ('아침 식사', '점심', 등)
 * @returns 백엔드 Enum 값 ('BREAKFAST', 'LUNCH', 등)
 */
export const convertToEnumMealType = (koreanMealType: string): string => {
  switch (koreanMealType) {
    case '아침 식사':
    case '아침':
      return MEAL_TYPE_ENUM.BREAKFAST;
    case '점심 식사':
    case '점심':
      return MEAL_TYPE_ENUM.LUNCH;
    case '저녁 식사':
    case '저녁':
      return MEAL_TYPE_ENUM.DINNER;
    case '간식':
      return MEAL_TYPE_ENUM.SNACK;
    default:
      console.warn('알 수 없는 식사 유형:', koreanMealType);
      return MEAL_TYPE_ENUM.BREAKFAST; // 기본값
  }
};

/**
 * 백엔드 Enum 값을 한글 식사 유형으로 변환
 * @param enumMealType 백엔드 Enum 값 ('BREAKFAST', 'LUNCH', 등)
 * @returns 한글 식사 유형 ('아침 식사', '점심 식사', 등)
 */
export const convertToKoreanMealType = (enumMealType: string | null | undefined): string => {
  // null 또는 undefined 체크
  if (!enumMealType) {
    console.warn('식사 유형이 null 또는 undefined입니다');
    return '아침 식사'; // 기본값
  }
  
  switch (enumMealType.toUpperCase()) {
    case MEAL_TYPE_ENUM.BREAKFAST:
      return '아침 식사';
    case MEAL_TYPE_ENUM.LUNCH:
      return '점심 식사';
    case MEAL_TYPE_ENUM.DINNER:
      return '저녁 식사';
    case MEAL_TYPE_ENUM.SNACK:
      return '간식';
    default:
      console.warn('알 수 없는 식사 유형 Enum:', enumMealType);
      return '아침 식사'; // 기본값
  }
};
