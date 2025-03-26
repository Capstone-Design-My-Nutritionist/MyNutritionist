// dummyCalendarData.ts
import dayjs from 'dayjs';

// 오늘 날짜 기준으로 데이터 생성
const today = dayjs();
const yesterday = today.subtract(1, 'day');
const twoDaysAgo = today.subtract(2, 'day');

// 특정 날짜에 데이터가 있는지 확인하는 함수
export const hasDataForDate = (date: dayjs.Dayjs): boolean => {
  const dateString = date.format('YYYY-MM-DD');
  return Object.keys(dummyCalendarMeals).includes(dateString);
};

// 더미 영양 데이터
export const dummyCalendarNutrition = {
  [today.format('YYYY-MM-DD')]: {
    totalCalories: 2300,
    consumedCalories: 1080,
    nutrients: {
      carbs: { consumed: 14, goal: 60 },
      protein: { consumed: 45.1, goal: 50 },
      fat: { consumed: 83.4, goal: 100 },
    },
  },
  [yesterday.format('YYYY-MM-DD')]: {
    totalCalories: 2300,
    consumedCalories: 1500,
    nutrients: {
      carbs: { consumed: 30, goal: 60 },
      protein: { consumed: 38, goal: 50 },
      fat: { consumed: 65, goal: 100 },
    },
  },
  [twoDaysAgo.format('YYYY-MM-DD')]: {
    totalCalories: 2300,
    consumedCalories: 1850,
    nutrients: {
      carbs: { consumed: 45, goal: 60 },
      protein: { consumed: 48, goal: 50 },
      fat: { consumed: 90, goal: 100 },
    },
  },
};

// 더미 식사 데이터
export const dummyCalendarMeals = {
  [today.format('YYYY-MM-DD')]: [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '아침 식사',
      totalCalories: 350,
      carbs: 10,
      protein: 15,
      fat: 20,
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '점심 식사',
      totalCalories: 450,
      carbs: 20,
      protein: 25,
      fat: 15,
    },
    {
      id: 3,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '저녁 식사',
      totalCalories: 280,
      carbs: 15,
      protein: 30,
      fat: 10,
    },
  ],
  [yesterday.format('YYYY-MM-DD')]: [
    {
      id: 4,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '아침 식사',
      totalCalories: 420,
      carbs: 25,
      protein: 18,
      fat: 15,
    },
    {
      id: 5,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '점심 식사',
      totalCalories: 580,
      carbs: 35,
      protein: 22,
      fat: 25,
    },
    {
      id: 6,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '저녁 식사',
      totalCalories: 500,
      carbs: 30,
      protein: 28,
      fat: 18,
    },
  ],
  [twoDaysAgo.format('YYYY-MM-DD')]: [
    {
      id: 7,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '아침 식사',
      totalCalories: 380,
      carbs: 22,
      protein: 15,
      fat: 18,
    },
    {
      id: 8,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '점심 식사',
      totalCalories: 620,
      carbs: 40,
      protein: 30,
      fat: 25,
    },
    {
      id: 9,
      imageUrl: 'https://via.placeholder.com/140x120',
      mealType: '저녁 식사',
      totalCalories: 850,
      carbs: 55,
      protein: 35,
      fat: 30,
    },
  ],
};
