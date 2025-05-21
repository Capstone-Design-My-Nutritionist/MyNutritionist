import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
  fetchMealRecords,
  deleteMeal,
  fetchUserInfo,
  fetchNutritionSummary,
} from '../../api/api';
import {
  convertToEnumMealType,
  convertToKoreanMealType,
} from '../../utils/mealTypeUtils';
import ProgressBar from '../../components/Progress/ProgressBar';
import FoodCard, {FoodCardProps} from '../../components/Card/FoodCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Shadow} from 'react-native-shadow-2';
import ArrowLeft from '../../../assets/images/arrow-left.svg';
import ArrowRight from '../../../assets/images/arrow-right.svg';
import {
  tempUserData,
  tempMeals,
  tempRecommendations,
} from '../../data/dummyHomeData';
import {
  dummyFood,
  dummyFoodRecommendationData,
} from '../../data/dummyFoodRecommendationData';
import SurveyPromptModal from '../../components/Modal/SurveyPromptModal';

// 음식 추천 데이터 타입 정의
type NutrientType = {
  콜레스테롤?: string;
  식이섬유?: string;
  칼슘?: string;
  나트륨?: string;
  당류?: string;
  비타민A?: string;
  비타민B?: string;
  비타민C?: string;
  비타민D?: string;
  비타민E?: string;
  비타민K?: string;
  철분?: string;
  칼륨?: string;
  포화지방?: string;
  오메가3?: string;
  [key: string]: string | undefined;
};

type FoodRecommendationType = {
  id: number;
  name: string;
  imageUrl: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  nutrients: NutrientType;
};

// 네비게이션 타입 정의
type MainStackParamList = {
  Home: undefined;
  NutritionDetails: {date: string};
  FoodRecommendation: any;
  MealRecord: {
    mealId?: number | string;
    date: string;
    mealType: string;
    foodName?: string;
  };
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [weekDates, setWeekDates] = useState<dayjs.Dayjs[]>([]);
  const [currentRecommendationIndex, setCurrentRecommendationIndex] =
    useState(0);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{
    id: number;
    mealType: string;
    foodName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  // 유저 정보 상태
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    nickname: string;
  } | null>(null);

  // 영양소 요약 데이터 상태
  const [nutritionSummary, setNutritionSummary] = useState<{
    consumedCalories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    [key: string]: number;
  } | null>(null);

  // 목표 영양소 값 (더미 데이터)
  const goalNutrition: {[key: string]: number} = {
    calories: 2000,
    carbs: 250,
    protein: 80,
    fat: 60,
    비타민A: 900, // µg
    비타민B: 1.3, // mg
    비타민C: 90, // mg
    비타민D: 15, // µg
    비타민E: 15, // mg
    칼슘: 1000, // mg
    철분: 8, // mg
    식이섬유: 25, // g
    나트륨: 2300, // mg
    칼륨: 3500, // mg
  };

  // 일주일 날짜 계산 (오늘 기준 전 3일, 후 3일)
  useEffect(() => {
    const today = dayjs();
    const dates = [];

    for (let i = -3; i <= 3; i++) {
      dates.push(today.add(i, 'day'));
    }

    setWeekDates(dates);
  }, []);

  // 유저 정보를 가져오는 함수
  const getUserInfo = async () => {
    try {
      // AsyncStorage에서 닉네임 가져오기
      const savedNickname = await AsyncStorage.getItem('userNickname');

      if (savedNickname) {
        // AsyncStorage에 저장된 닉네임이 있는 경우
        setUserInfo({
          name: savedNickname,
          email: 'user@example.com',
          nickname: savedNickname,
        });
        console.log('👤 AsyncStorage에서 닉네임 가져오기 성공:', savedNickname);
        return;
      }

      // AsyncStorage에 닉네임이 없는 경우 API 호출 시도
      const response = await fetchUserInfo();
      if (response && response.data) {
        setUserInfo(response.data);
        console.log('유저 정보 가져오기 성공:', response.data);

        // 가져온 닉네임을 AsyncStorage에 저장
        if (response.data.nickname) {
          await AsyncStorage.setItem('userNickname', response.data.nickname);
          console.log('👤 닉네임 저장 완료:', response.data.nickname);
        }
      }
    } catch (error) {
      console.error('유저 정보 가져오기 오류:', error);
      // 오류 발생 시 더미 데이터 사용
      setUserInfo({
        name: tempUserData.name,
        email: 'user@example.com',
        nickname: tempUserData.name,
      });
    }
  };

  // 영양소 요약 데이터 가져오기
  const getNutritionSummary = async (date: string) => {
    try {
      const response = await fetchNutritionSummary(date);
      if (response && response.data) {
        // energy 값을 consumedCalories로 사용
        const apiData = response.data;
        const formattedData = {
          ...apiData,
          consumedCalories:
            apiData.energy !== undefined
              ? apiData.energy
              : apiData.consumedCalories || 0,
        };

        setNutritionSummary(formattedData);
        console.log('영양소 요약 데이터 가져오기 성공:', formattedData);
      }
    } catch (error) {
      console.error('영양소 요약 데이터 가져오기 오류:', error);
      // 오류 발생 시 더미 데이터 사용
      setNutritionSummary({
        consumedCalories: tempUserData.consumedCalories,
        carbohydrate: tempUserData.nutrients.carbs.consumed,
        protein: tempUserData.nutrients.protein.consumed,
        fat: tempUserData.nutrients.fat.consumed,
      });
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    // 선택된 날짜의 식사 데이터 가져오기
    const formattedDate = date.format('YYYY-MM-DD');
    fetchMealData(formattedDate);
    // 선택된 날짜의 영양소 요약 데이터 가져오기
    getNutritionSummary(formattedDate);
  };

  // 영양소 부족 정도 계산 및 가장 부족한 영양소 찾기
  const [deficientNutrient, setDeficientNutrient] = useState<string | null>(
    null,
  );
  const [recommendedFoods, setRecommendedFoods] = useState<
    FoodRecommendationType[]
  >([]);

  // 영양소 부족 분석 및 음식 추천
  useEffect(() => {
    if (!nutritionSummary || !meals || meals.length === 0) {
      setDeficientNutrient(null);
      setRecommendedFoods([]);
      return;
    }

    // 영양소 비율 계산
    const nutrientRatios: {[key: string]: number} = {};

    // 기본 영양소 계산 (calories, carbs, protein, fat)
    nutrientRatios['calories'] =
      (nutritionSummary.consumedCalories / goalNutrition.calories) * 100;
    nutrientRatios['carbs'] =
      (nutritionSummary.carbohydrate / goalNutrition.carbs) * 100;
    nutrientRatios['protein'] =
      (nutritionSummary.protein / goalNutrition.protein) * 100;
    nutrientRatios['fat'] = (nutritionSummary.fat / goalNutrition.fat) * 100;

    // 추가 영양소 계산 (API에서 받아온 데이터가 있다면)
    Object.keys(nutritionSummary).forEach(key => {
      if (
        key !== 'consumedCalories' &&
        key !== 'carbohydrate' &&
        key !== 'protein' &&
        key !== 'fat'
      ) {
        if (goalNutrition[key]) {
          nutrientRatios[key] =
            (nutritionSummary[key] / goalNutrition[key]) * 100;
        }
      }
    });

    // 30% 이하인 영양소 필터링
    const deficientNutrients = Object.entries(nutrientRatios)
      .filter(([_, ratio]) => ratio <= 30)
      .sort((a, b) => a[1] - b[1]); // 가장 부족한 순으로 정렬

    if (deficientNutrients.length > 0) {
      // 가장 부족한 영양소 선택
      const mostDeficient = deficientNutrients[0][0];
      setDeficientNutrient(mostDeficient);

      // 해당 영양소가 높은 음식 추천
      let recommendableFoods: FoodRecommendationType[] = [];

      // 영양소 이름 매핑 (API 키와 더미 데이터 키가 다를 수 있음)
      const nutrientMapping: {[key: string]: string} = {
        calories: 'kcal',
        carbs: 'carbs',
        protein: 'protein',
        fat: 'fat',
        비타민A: '비타민A',
        비타민B: '비타민B',
        비타민C: '비타민C',
        비타민D: '비타민D',
        비타민E: '비타민E',
        칼슘: '칼슘',
        철분: '철분',
        식이섬유: '식이섬유',
        나트륨: '나트륨',
        칼륨: '칼륨',
      };

      const mappedNutrient = nutrientMapping[mostDeficient] || mostDeficient;

      // 기본 영양소 (kcal, carbs, protein, fat)인 경우
      if (['calories', 'carbs', 'protein', 'fat'].includes(mostDeficient)) {
        // 더미 데이터를 FoodRecommendationType으로 형변환하여 사용
        const typedFoodData =
          dummyFoodRecommendationData as FoodRecommendationType[];

        recommendableFoods = typedFoodData
          .sort((a, b) => {
            let valueA: number, valueB: number;

            if (mostDeficient === 'calories') {
              valueA = a.kcal;
              valueB = b.kcal;
            } else if (mostDeficient === 'carbs') {
              valueA = a.carbs;
              valueB = b.carbs;
            } else if (mostDeficient === 'protein') {
              valueA = a.protein;
              valueB = b.protein;
            } else {
              // fat
              valueA = a.fat;
              valueB = b.fat;
            }

            return valueB - valueA; // 내림차순 정렬
          })
          .slice(0, 4); // 상위 4개 음식 선택
      }
      // 기타 영양소인 경우
      else {
        // 더미 데이터를 FoodRecommendationType으로 형변환하여 사용
        const typedFoodData =
          dummyFoodRecommendationData as FoodRecommendationType[];

        recommendableFoods = typedFoodData
          .filter(food => {
            // 해당 영양소 값이 있는지 확인
            const nutrientValue = food.nutrients[mappedNutrient];
            return (
              nutrientValue &&
              nutrientValue !== '0' &&
              nutrientValue !== '0g' &&
              nutrientValue !== '0mg' &&
              nutrientValue !== '0µg'
            );
          })
          .sort((a, b) => {
            // 단위 제거하고 숫자만 추출하여 비교
            const valueA = parseFloat(
              (a.nutrients[mappedNutrient] || '0').replace(/[^0-9.]/g, '') ||
                '0',
            );
            const valueB = parseFloat(
              (b.nutrients[mappedNutrient] || '0').replace(/[^0-9.]/g, '') ||
                '0',
            );
            return valueB - valueA; // 내림차순 정렬
          })
          .slice(0, 4); // 상위 4개 음식 선택
      }

      setRecommendedFoods(recommendableFoods);
    } else {
      setDeficientNutrient(null);
      setRecommendedFoods([]);
    }
  }, [nutritionSummary, meals]);

  // 추천 메뉴 이전 버튼 핸들러
  const handlePrevRecommendation = () => {
    setCurrentRecommendationIndex(prev =>
      prev === 0 ? tempRecommendations.length - 1 : prev - 1,
    );
  };

  // 추천 메뉴 다음 버튼 핸들러
  const handleNextRecommendation = () => {
    setCurrentRecommendationIndex(prev =>
      prev === tempRecommendations.length - 1 ? 0 : prev + 1,
    );
  };

  // 영양 상세 화면으로 이동
  const navigateToNutritionDetails = () => {
    navigation.navigate('NutritionDetails', {
      date: selectedDate.format('YYYY.MM.DD'),
    });
  };

  // 식사 상세 화면으로 이동
  const navigateToMealRecords = (meal: any) => {
    // 한글 식사 유형을 백엔드 Enum 값으로 변환
    const backendMealType = convertToEnumMealType(meal.mealType);

    console.log('식사 상세 화면으로 이동:', {
      date: selectedDate.format('YYYY.MM.DD'),
      mealType: meal.mealType,
      foodName: meal.foodName,
    });

    navigation.navigate('MealRecord', {
      mealId: meal.id,
      date: selectedDate.format('YYYY.MM.DD'),
      mealType: meal.mealType,
    });
  };

  // 음식 추천 상세 화면으로 이동
  const navigateToFoodRecommendation = (food: any) => {
    navigation.navigate('FoodRecommendation', food);
  };

  // 한글 식사 유형을 백엔드 Enum 값으로 변환하는 함수 - 유틸리티 함수 사용
  const convertMealType = convertToEnumMealType;

  // 백엔드 Enum 값을 한글 식사 유형으로 변환하는 함수 - 유틸리티 함수 사용
  // 유틸리티 함수를 import하여 사용

  // 음식 삭제 처리
  const handleDeleteMeal = async () => {
    if (!selectedMeal) return;

    try {
      // 한글 식사 유형을 백엔드 Enum 값으로 변환
      const backendMealType = convertMealType(selectedMeal.mealType);
      console.log(
        '변환된 식사 유형:',
        selectedMeal.mealType,
        '->',
        backendMealType,
      );

      // 식사 이름이 없는 경우 처리
      if (!selectedMeal.foodName || selectedMeal.foodName.trim() === '') {
        throw new Error('음식 이름이 없습니다.');
      }

      // API 호출
      await deleteMeal(
        selectedDate.format('YYYY-MM-DD'),
        backendMealType,
        selectedMeal.foodName,
      );

      // 삭제 성공 후 로컬 데이터 업데이트
      setMeals(prevMeals =>
        prevMeals.filter(meal => meal.id !== selectedMeal.id),
      );

      // 모달 닫기
      setDeleteModalVisible(false);

      // 성공 메시지 표시
      Alert.alert('삭제 완료', '음식이 삭제되었습니다.');

      // 삭제 후 데이터 다시 가져오기
      fetchMealData(selectedDate.format('YYYY-MM-DD'));
    } catch (error: any) {
      console.error('음식 삭제 오류:', error);

      // 상세 오류 메시지 표시
      const errorMessage = error.message || '음식 삭제 중 오류가 발생했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      // 삭제 모드 유지
      // setIsDeleteMode(false);
    }
  };

  // 식사 기록 데이터 가져오기
  const fetchMealData = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const mealData = await fetchMealRecords(date);
      console.log('API 응답 데이터:', JSON.stringify(mealData, null, 2));

      if (mealData && mealData.meals && Array.isArray(mealData.meals)) {
        // API 응답 데이터를 FoodCard에 맞는 형식으로 변환
        const formattedMeals = mealData.meals.flatMap(
          (mealGroup: any, index: number) => {
            // mealGroup이 유효한지 확인
            if (
              !mealGroup ||
              !mealGroup.foods ||
              !Array.isArray(mealGroup.foods)
            ) {
              console.warn('유효하지 않은 mealGroup:', mealGroup);
              return [];
            }

            // mealType이 유효한지 확인
            const koreanMealType = mealGroup.mealType
              ? convertToKoreanMealType(mealGroup.mealType)
              : '아침 식사';

            return mealGroup.foods
              .map((food: any, foodIndex: number) => {
                // food가 유효한지 확인
                if (!food || !food.nutrition) {
                  console.warn('유효하지 않은 food 데이터:', food);
                  return null;
                }

                // 음수인 경우 0으로 처리하는 함수
                const formatNutrientValue = (value: any): number => {
                  const num = parseFloat(value || 0);
                  return num < 0 ? 0 : parseFloat(num.toFixed(1));
                };

                return {
                  id: `${index}-${foodIndex}`,
                  imageUrl: food.imageUrl || 'https://via.placeholder.com/150', // 이미지가 없는 경우 기본 이미지 사용
                  mealType: koreanMealType,
                  totalCalories: formatNutrientValue(food.nutrition.energy),
                  carbs: formatNutrientValue(food.nutrition.carbohydrate),
                  protein: formatNutrientValue(food.nutrition.protein),
                  fat: formatNutrientValue(food.nutrition.fat),
                  foodName:
                    food.combinedFoodNames || food.name || '알 수 없는 음식',
                };
              })
              .filter(Boolean); // null 값 제거
          },
        );

        console.log('변환된 데이터:', formattedMeals.length, '개의 식사');
        setMeals(formattedMeals);
      } else {
        console.log('식사 데이터가 없거나 유효하지 않음');
        // 데이터가 없는 경우 빈 배열로 설정
        setMeals([]);
      }
    } catch (error) {
      console.error('식사 기록 조회 오류:', error);
      setError('식사 기록을 불러오는 중 오류가 발생했습니다.');
      // 오류 발생 시 임시 데이터 사용 (개발 중에만 사용)
      setMeals(tempMeals);
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 변경 시 데이터 다시 가져오기
  useEffect(() => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    fetchMealData(formattedDate);
  }, [selectedDate]);

  // 컴포넌트 마운트 시 유저 정보 가져오기
  useEffect(() => {
    getUserInfo();
  }, []);

  // 컴포넌트 마운트 시 오늘 날짜의 데이터 가져오기
  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    fetchMealData(today);
    getNutritionSummary(today);
  }, []);

  // 현재 표시할 추천 메뉴
  const currentRecommendation = tempRecommendations[currentRecommendationIndex];

  useEffect(() => {
    const checkSurveyStatus = async () => {
      const hasCompleted = await AsyncStorage.getItem('hasCompletedSurvey');
      if (!hasCompleted) {
        setShowSurveyModal(true);
      }
    };
    checkSurveyStatus();
  }, []);

  return (
    <Container>
      <SurveyPromptModal
        visible={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onParticipate={() => {
          setShowSurveyModal(false);
          AsyncStorage.setItem('hasCompletedSurvey', 'false'); // 초기값 저장
          // @ts-ignore
          navigation.navigate('SurveyGenderScreen'); // 설문 시작 화면으로
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상단 환영 메시지 + 배경 영역 */}

        <HeaderContainer>
          <WelcomeText>
            {userInfo?.nickname || tempUserData.name} 님 안녕하세요!
          </WelcomeText>
          <SubText>제가 당신의 개인 영양사가 되어드릴게요!</SubText>
          <DividerLine />
          {/* 일주일 날짜 캘린더 */}
          <DateContainer>
            {weekDates.map((date, index) => {
              const isSelected =
                date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD');
              return (
                <DateItem key={index} onPress={() => handleDateSelect(date)}>
                  <DayText>{date.locale('ko').format('ddd')}</DayText>
                  <DateCircle isSelected={isSelected}>
                    <DateText isSelected={isSelected}>{date.date()}</DateText>
                  </DateCircle>
                </DateItem>
              );
            })}
          </DateContainer>
        </HeaderContainer>

        {/* 총 섭취량 요약 블럭 */}
        <SummaryContainer>
          <SummaryHeader>
            <DateInfoText>{selectedDate.format('YYYY.MM.DD')}</DateInfoText>
            <DetailButton onPress={navigateToNutritionDetails}>
              <DetailText>자세히</DetailText>
              <Icon name="chevron-right" size={14} color="#8E8E8E" />
            </DetailButton>
          </SummaryHeader>

          <TotalIntakeText>총 섭취량</TotalIntakeText>
          <CalorieInfoContainer>
            <CalorieText>
              {(nutritionSummary?.consumedCalories !== undefined &&
              nutritionSummary?.consumedCalories >= 0
                ? nutritionSummary?.consumedCalories
                : tempUserData.consumedCalories >= 0
                ? tempUserData.consumedCalories
                : 0
              ).toFixed(1)}
            </CalorieText>
            <CalorieUnit>/ {goalNutrition.calories}kcal</CalorieUnit>
          </CalorieInfoContainer>

          <ProgressBarContainer>
            <ProgressBarBackground>
              <ProgressBarFill
                width={
                  (((nutritionSummary?.consumedCalories !== undefined &&
                  nutritionSummary?.consumedCalories >= 0
                    ? nutritionSummary?.consumedCalories
                    : 0) ||
                    (tempUserData.consumedCalories >= 0
                      ? tempUserData.consumedCalories
                      : 0)) /
                    goalNutrition.calories) *
                  100
                }
              />
            </ProgressBarBackground>
          </ProgressBarContainer>

          <NutrientProgressContainer>
            <ProgressBar
              id={1}
              label="탄수화물"
              consumed={parseFloat(
                (nutritionSummary?.carbohydrate !== undefined &&
                nutritionSummary?.carbohydrate >= 0
                  ? nutritionSummary?.carbohydrate
                  : tempUserData.nutrients.carbs.consumed >= 0
                  ? tempUserData.nutrients.carbs.consumed
                  : 0
                ).toFixed(1),
              )}
              goal={goalNutrition.carbs}
              progressColor="#FD384C"
              unit="g"
            />
            <ProgressBar
              id={2}
              label="단백질"
              consumed={parseFloat(
                (nutritionSummary?.protein !== undefined &&
                nutritionSummary?.protein >= 0
                  ? nutritionSummary?.protein
                  : tempUserData.nutrients.protein.consumed >= 0
                  ? tempUserData.nutrients.protein.consumed
                  : 0
                ).toFixed(1),
              )}
              goal={goalNutrition.protein}
              progressColor="#D95B72"
              unit="g"
            />
            <ProgressBar
              id={3}
              label="지방"
              consumed={parseFloat(
                (nutritionSummary?.fat !== undefined &&
                nutritionSummary?.fat >= 0
                  ? nutritionSummary?.fat
                  : tempUserData.nutrients.fat.consumed >= 0
                  ? tempUserData.nutrients.fat.consumed
                  : 0
                ).toFixed(1),
              )}
              goal={goalNutrition.fat}
              progressColor="#FD9E38"
              unit="g"
            />
          </NutrientProgressContainer>
        </SummaryContainer>

        <SectionDivider />
        {/* 오늘 섭취한 음식 영역 */}
        <SectionContainer>
          <SectionTitleRow>
            <SectionTitle>오늘의 식사</SectionTitle>
            <DeleteButton onPress={() => setIsDeleteMode(!isDeleteMode)}>
              <DeleteButtonText>
                {isDeleteMode ? '취소' : '삭제하기'}
              </DeleteButtonText>
              <Icon
                name={isDeleteMode ? 'close' : 'delete-outline'}
                size={16}
                color="#D95B72"
              />
            </DeleteButton>
          </SectionTitleRow>

          {/* 식사 카드 목록 */}
          <FoodCardsContainer>
            {isLoading ? (
              <LoadingContainer>
                <ActivityIndicator size="large" color="#D95B72" />
                <LoadingText>식사 기록을 불러오는 중...</LoadingText>
              </LoadingContainer>
            ) : error ? (
              <ErrorContainer>
                <ErrorText>{error}</ErrorText>
              </ErrorContainer>
            ) : meals.length > 0 ? (
              meals.map(meal => (
                <FoodCardWrapper key={meal.id}>
                  <FoodCard
                    id={meal.id}
                    imageUrl={meal.imageUrl}
                    mealType={meal.mealType}
                    totalCalories={meal.totalCalories}
                    carbs={meal.carbs}
                    protein={meal.protein}
                    fat={meal.fat}
                    foodName={meal.foodName}
                    onPress={() =>
                      navigation.navigate('MealRecord', {
                        mealId: meal.id,
                        date: selectedDate.format('YYYY.MM.DD'),
                        mealType: meal.mealType,
                      })
                    }
                    isDeleteMode={isDeleteMode}
                    onDeletePress={() => {
                      if (isDeleteMode) {
                        // 삭제 모달 표시
                        setSelectedMeal({
                          id: meal.id,
                          mealType: meal.mealType,
                          foodName: meal.foodName || '',
                        });
                        setDeleteModalVisible(true);
                      }
                    }}
                  />
                </FoodCardWrapper>
              ))
            ) : (
              <EmptyFoodContainer>
                <EmptyFoodText>
                  오늘 등록된 식사가 없습니다.{'\n'}
                  상단의 + 버튼을 눌러 식사를 등록해보세요!
                </EmptyFoodText>
              </EmptyFoodContainer>
            )}
          </FoodCardsContainer>

          {/* 삭제 확인 모달 */}
          <Modal
            transparent={true}
            visible={deleteModalVisible}
            animationType="fade"
            onRequestClose={() => setDeleteModalVisible(false)}>
            <ModalOverlay>
              <ModalContainer>
                <ModalTitle>음식 삭제</ModalTitle>
                <ModalText>정말 이 음식을 삭제하시겠습니까?</ModalText>
                <ModalButtonContainer>
                  <ModalCancelButton
                    onPress={() => setDeleteModalVisible(false)}>
                    <ModalButtonText isCancel={true}>취소</ModalButtonText>
                  </ModalCancelButton>
                  <ModalConfirmButton onPress={handleDeleteMeal}>
                    <ModalButtonText isCancel={false}>예</ModalButtonText>
                  </ModalConfirmButton>
                </ModalButtonContainer>
              </ModalContainer>
            </ModalOverlay>
          </Modal>
        </SectionContainer>
        <SectionDivider />

        {/* 식사 메뉴 추천 영역 */}
        <SectionContainer>
          <SectionTitle>식사 메뉴 추천</SectionTitle>

          {meals.length === 0 ? (
            // 음식 기록이 없는 경우
            <NoDataContainer>
              <NoDataText>
                음식 데이터가 부족해서 음식을 추천해드릴 수 없습니다.
              </NoDataText>
            </NoDataContainer>
          ) : deficientNutrient && recommendedFoods.length > 0 ? (
            // 부족한 영양소가 있고 추천 음식이 있는 경우
            <>
              <RecommendationMessageContainer>
                <RecommendationMessageText>
                  오늘은{' '}
                  {deficientNutrient === 'calories'
                    ? '칼로리'
                    : deficientNutrient === 'carbs'
                    ? '탄수화물'
                    : deficientNutrient === 'protein'
                    ? '단백질'
                    : deficientNutrient === 'fat'
                    ? '지방'
                    : deficientNutrient}{' '}
                  섭취가 부족해요. 이런 음식들은 어떠세요?
                </RecommendationMessageText>
              </RecommendationMessageContainer>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginBottom: 20}}>
                {recommendedFoods.map((food, index) => (
                  <FoodRecommendCard
                    key={`food-${index}`}
                    onPress={() => navigateToFoodRecommendation(food)}>
                    <FoodRecommendImage source={{uri: food.imageUrl}} />
                    <FoodRecommendContent>
                      <FoodRecommendTitle>{food.name}</FoodRecommendTitle>
                      <FoodRecommendDescription>
                        {deficientNutrient === 'calories'
                          ? `${food.kcal}kcal`
                          : deficientNutrient === 'carbs'
                          ? `탄수화물 ${food.carbs}g`
                          : deficientNutrient === 'protein'
                          ? `단백질 ${food.protein}g`
                          : deficientNutrient === 'fat'
                          ? `지방 ${food.fat}g`
                          : `${deficientNutrient} ${
                              food.nutrients[deficientNutrient] || ''
                            }`}
                      </FoodRecommendDescription>
                    </FoodRecommendContent>
                  </FoodRecommendCard>
                ))}
              </ScrollView>
            </>
          ) : (
            // 부족한 영양소가 없거나 추천 음식이 없는 경우 (기존 추천 표시)
            <RecommendationContainer>
              <ArrowButton onPress={handlePrevRecommendation}>
                <ArrowLeft width={24} height={24} />
              </ArrowButton>

              <RecommendationCard>
                <RecommendationImageContainer>
                  <RecommendationImage
                    source={{uri: currentRecommendation.imageUrl}}
                    resizeMode="cover"
                  />
                </RecommendationImageContainer>
                <RecommendationInfo>
                  <RecommendationName>
                    {currentRecommendation.name}
                  </RecommendationName>
                  <RecommendationCalories>
                    {currentRecommendation.calories} kcal
                  </RecommendationCalories>

                  <NutrientRow>
                    <NutrientLabel>탄수화물</NutrientLabel>
                    <NutrientValue color="#FD384C">
                      {currentRecommendation.carbs}g
                    </NutrientValue>
                  </NutrientRow>
                  <NutrientRow>
                    <NutrientLabel>단백질</NutrientLabel>
                    <NutrientValue color="#D95B72">
                      {currentRecommendation.protein}g
                    </NutrientValue>
                  </NutrientRow>
                  <NutrientRow>
                    <NutrientLabel>지방</NutrientLabel>
                    <NutrientValue color="#FD9E38">
                      {currentRecommendation.fat}g
                    </NutrientValue>
                  </NutrientRow>
                </RecommendationInfo>
              </RecommendationCard>

              <ArrowButton onPress={handleNextRecommendation}>
                <ArrowRight width={24} height={24} />
              </ArrowButton>
            </RecommendationContainer>
          )}
        </SectionContainer>

        {/* 하단 여백 */}
        <BottomSpacer />
      </ScrollView>
    </Container>
  );
};

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #fffbfb;
`;

const HeaderContainer = styled.View`
  background-color: #e44f68;
  height: 285px;
  width: 100%;
  padding: 20px;
  padding-top: 60px;
  align-items: left;
`;

const WelcomeText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 8px;
`;

const SubText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 30px;
`;

const DividerLine = styled.View`
  height: 1px;
  width: 100%;
  background-color: #ffffff;
  opacity: 0.5;
  margin-bottom: 8px;
`;

const DateContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  margin-top: 12px;
`;

const DateItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const DayText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 8px;
`;

const DateCircle = styled.View<{isSelected: boolean}>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? '#FFFFFF' : 'transparent'};
  align-items: center;
  justify-content: center;
`;

const DateText = styled.Text<{isSelected: boolean}>`
  font-family: 'Pretendard-ExtraBold';
  font-size: 14px;
  color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? '#E44F68' : '#FFFFFF'};
`;

const SummaryContainer = styled.View`
  background-color: #ffffff;
  margin: -40px 20px 0;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const SummaryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: right;
  margin-bottom: 15px;
`;

const DateInfoText = styled.Text`
  font-family: 'Pretendard-SemiBold';
  font-size: 12px;
  color: #8e8e8e;
`;

const DetailButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const DetailText = styled.Text`
  font-family: 'Pretendard-SemiBold';
  font-size: 12px;
  color: #8e8e8e;
`;

const TotalIntakeText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #111111;
  margin-bottom: 8px;
`;

const CalorieInfoContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 12px;
`;

const CalorieText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 24px;
  color: #e44f68;
`;

const CalorieUnit = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8e8e8e;
  margin-left: 4px;
`;

const ProgressBarContainer = styled.View`
  margin-bottom: 20px;
`;

const ProgressBarBackground = styled.View`
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressBarFill = styled.View<{width: number}>`
  height: 100%;
  width: ${(props: {width: number}) => Math.min(props.width, 100)}%;
  background-color: #e44f68;
  border-radius: 5px;
`;

const NutrientProgressContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const SectionContainer = styled.View`
  margin: 8px 20px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-family: 'Pretendard-Bold';
  margin-bottom: 8px;
  color: #333;
`;

const DeleteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #d95b72;
`;

const DeleteButtonText = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Medium';
  color: #d95b72;
  margin-right: 4px;
`;

const FoodCardsContainer = styled.View`
  align-items: center;
`;

const FoodCardWrapper = styled.View`
  margin-bottom: 16px;
`;

const EmptyFoodContainer = styled.View`
  height: 120px;
  background-color: #f8f8f8;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyFoodText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8e8e8e;
  text-align: center;
`;

const LoadingContainer = styled.View`
  height: 120px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8e8e8e;
  margin-top: 10px;
`;

const ErrorContainer = styled.View`
  height: 120px;
  background-color: #fff8f8;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #d95b72;
  text-align: center;
`;

const RecommendationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ArrowButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 6px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const NoDataContainer = styled.View`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f0f0;
`;

const NoDataText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #888888;
  text-align: center;
`;

const RecommendationMessageContainer = styled.View`
  background-color: #fff5f5;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
  border: 1px solid #ffdbdb;
  border-left-width: 4px;
  border-left-color: #e44f68;
`;

const RecommendationMessageText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 15px;
  color: #731a22;
`;

const FoodRecommendCard = styled.TouchableOpacity`
  width: 180px;
  margin-right: 12px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
`;

const FoodRecommendImage = styled.Image`
  width: 100%;
  height: 120px;
  resize-mode: cover;
`;

const FoodRecommendContent = styled.View`
  padding: 10px;
`;

const FoodRecommendTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #333333;
  margin-bottom: 4px;
`;

const FoodRecommendDescription = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 12px;
  color: #e44f68;
`;

const RecommendationCard = styled.View`
  flex: 1;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RecommendationImageContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
`;

const RecommendationImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const RecommendationInfo = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: flex-start;
`;

const RecommendationName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #111111;
  margin-bottom: 4px;
`;

const RecommendationCalories = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #e44f68;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
`;

const NutrientLabel = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 12px;
  color: #111111;
`;

const NutrientValue = styled.Text<{color: string}>`
  font-family: 'Pretendard-Bold';
  font-size: 12px;
  color: ${(props: {color: string}) => props.color};
`;

const BottomSpacer = styled.View`
  height: 100px;
`;

const EmptyRecommendContainer = styled.View`
  height: 140px;
  background-color: #f8f8f8;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyRecommendText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8e8e8e;
  text-align: center;
`;

const SectionDivider = styled.View`
  height: 8px;
  background-color: #e1e3e7;
  margin-vertical: 8px;
`;

// Modal styled components
const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: 300px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #333;
  margin-bottom: 16px;
`;

const ModalText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Regular';
  color: #666;
  margin-bottom: 20px;
  text-align: center;
`;

const ModalButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ModalCancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 6px;
  margin-right: 8px;
  align-items: center;
`;

const ModalConfirmButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  background-color: #d95b72;
  border-radius: 6px;
  margin-left: 8px;
  align-items: center;
`;

const ModalButtonText = styled.Text<{isCancel: boolean}>`
  font-size: 14px;
  font-family: 'Pretendard-Medium';
  color: ${(props: {isCancel: boolean}) => (props.isCancel ? '#666' : 'white')};
`;

export default HomeScreen;
