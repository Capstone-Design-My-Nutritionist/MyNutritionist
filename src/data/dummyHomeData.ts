// 임시 사용자 데이터 (백엔드 연동 전까지 사용)
export const tempUserData = {
  name: '홍길동',
  totalCalories: 2300,
  consumedCalories: 1080,
  nutrients: {
    carbs: {consumed: 1.4, goal: 60},
    protein: {consumed: 45.1, goal: 50},
    fat: {consumed: 83.4, goal: 100},
  },
};

// 임시 식사 데이터
export const tempMeals = [
  {
    id: 1,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfSgdaDjTWEIRGvaMO7J4RVRymcw2-3O9EBafiMwzlG7KXeuzOvWlsIVoRb9WFGB80SF4&usqp=CAU',
    mealType: '아침 식사',
    totalCalories: 933,
    carbs: 1.4,
    protein: 45.1,
    fat: 63.4,
  },
  {
    id: 2,
    imageUrl: 'https://i.namu.wiki/i/ZyyoGkA1YXGqME1JRcI81QoOfxzSlKWCNaEzAn2sbbzqHgU2jqH675UqqmnLSaHo0KRYWcebuC-Vo1uNRqUuZA.webp',
    mealType: '점심 식사',
    totalCalories: 933,
    carbs: 1.4,
    protein: 45.1,
    fat: 63.4,
  },
  {
    id: 3,
    imageUrl: 'https://i.namu.wiki/i/_cLeYQStb5Xf8h6vC4ZtRoGFvsF1-rb9wqUMJ9pS510fYeJCGOnh-CQ0A0n9YNHbZ5Roi4WX3NB5RTPdYmhJyg.webp',
    mealType: '저녁 식사',
    totalCalories: 933,
    carbs: 1.4,
    protein: 45.1,
    fat: 63.4,
  },
];

// 임시 추천 메뉴 데이터
export const tempRecommendations = [
  {
    id: 1,
    name: '닭가슴살 샐러드',
    imageUrl: 'https://static.wtable.co.kr/image/production/service/recipe/2184/2bff748d-c37e-4378-9f4e-80768739949a.jpg',
    calories: 223,
    carbs: 10.2,
    protein: 32.1,
    fat: 8.3,
  },
  {
    id: 2,
    name: '연어 스테이크',
    imageUrl: 'https://recipe1.ezmember.co.kr/cache/recipe/2015/04/09/8420790d8056554d2b1db7b2cfa35a4d1.jpg',
    calories: 320,
    carbs: 5.2,
    protein: 42.1,
    fat: 12.3,
  },
  {
    id: 3,
    name: '퀴노아 볼',
    imageUrl: 'https://i.ytimg.com/vi/MRwbTRq5xjk/maxresdefault.jpg',
    calories: 280,
    carbs: 35.2,
    protein: 12.1,
    fat: 6.3,
  },
];
