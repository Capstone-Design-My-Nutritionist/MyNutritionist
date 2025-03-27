// dummyMealRecordData.ts
// 식사 기록에 대한 더미 데이터

export const dummyMealRecords = [
  {
    id: 1,
    date: '2025.01.25',
    mealType: '아침',
    mainFood: {
      name: '삼겹살 & 김치볶음',
      imageUrl: 'https://www.sbfoods-worldwide.com/ko/recipes/deq4os000000086z-img/9_Samgyeopsal.jpg',
      kcal: 938,
      carbs: 1.4,
      fat: 83.4,
      protein: 45.1,
      serving: '1인분 200g',
      nutrients: {
        '콜레스테롤': '110mg',
        '나트륨': '1152.8mg',
        '칼륨': '480mg',
        '철분': '1.2mg',
        '아연': '3.5mg',
        '비타민B1': '0.8mg',
        '비타민B2': '0.2mg',
      },
    },
    additionalFoods: [
      {
        name: '상추',
        serving: '1인분 30g',
        kcal: 5,
        actualAmount: '50g',
        nutrients: {
          '식이섬유': '1.5g',
          '칼슘': '36mg',
          '비타민A': '3500IU',
          '비타민C': '9mg',
          '엽산': '38mcg',
        },
      },
    ],
  },
  {
    id: 2,
    date: '2025.01.25',
    mealType: '점심',
    mainFood: {
      name: '계란 프라이 & 토스트',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/09/10/14/23/breakfast-2735404_1280.jpg',
      kcal: 350,
      carbs: 30.2,
      fat: 18.5,
      protein: 12.3,
      serving: '1인분',
      nutrients: {
        '콜레스테롤': '210mg',
        '나트륨': '580mg',
        '칼슘': '42mg',
        '철분': '2.1mg',
        '비타민A': '180mcg',
        '비타민D': '1.1mcg',
      },
    },
    additionalFoods: [
      {
        name: '오렌지 주스',
        serving: '1잔 200ml',
        kcal: 90,
        actualAmount: '200ml',
        nutrients: {
          '당류': '20g',
          '비타민C': '24mg',
          '엽산': '40mcg',
          '칼륨': '450mg',
        },
      },
    ],
  },
  {
    id: 3,
    date: '2025.01.25',
    mealType: '저녁',
    mainFood: {
      name: '불고기 비빔밥',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/10/13/05/53/bibimbap-1736879_1280.jpg',
      kcal: 650,
      carbs: 85.2,
      fat: 22.3,
      protein: 25.8,
      serving: '1인분',
      nutrients: {
        '콜레스테롤': '65mg',
        '나트륨': '950mg',
        '칼륨': '520mg',
        '철분': '3.8mg',
        '아연': '2.9mg',
        '비타민A': '250mcg',
        '비타민C': '15mg',
      },
    },
    additionalFoods: [
      {
        name: '된장국',
        serving: '1인분 200ml',
        kcal: 45,
        actualAmount: '200ml',
        nutrients: {
          '나트륨': '480mg',
          '단백질': '3g',
          '칼슘': '25mg',
          '철분': '0.8mg',
        },
      },
    ],
  },
];

// 기본 더미 데이터 (fallback용)
export const dummyMealRecord = {
  id: 1,
  date: '2025.01.25',
  mealType: '점심',
  mainFood: {
    name: '삼겹살 & 김치볶음',
    imageUrl: 'https://www.sbfoods-worldwide.com/ko/recipes/deq4os000000086z-img/9_Samgyeopsal.jpg',
    kcal: 938,
    carbs: 1.4,
    fat: 83.4,
    protein: 45.1,
    serving: '1인분 200g',
    nutrients: {
      '콜레스테롤': '110mg',
      '나트륨': '1152.8mg',
      '칼륨': '480mg',
      '철분': '1.2mg',
      '아연': '3.5mg',
      '비타민B1': '0.8mg',
      '비타민B2': '0.2mg',
    },
  },
  additionalFoods: [
    {
      name: '상추',
      serving: '1인분 30g',
      kcal: 5,
      actualAmount: '50g',
      nutrients: {
        '식이섬유': '1.5g',
        '칼슘': '36mg',
        '비타민A': '3500IU',
        '비타민C': '9mg',
        '엽산': '38mcg',
      },
    },
  ],
};

// 단일 식사 기록 조회를 위한 함수
export const getMealRecordById = (id: number) => {
  return dummyMealRecords.find(record => record.id === id);
};

// 날짜와 식사 타입으로 식사 기록 조회를 위한 함수
export const getMealRecordByDateAndType = (date: string, mealType: string) => {
  return dummyMealRecords.find(
    record => record.date === date && record.mealType === mealType
  );
};
