import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import ProgressBar from '../../components/Progress/ProgressBar';
import FoodCard from '../../components/Card/FoodCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ArrowRight from '../../../assets/images/arrow-right.svg';
import DatePickerModal from '../../components/Modal/DatePickerModal';
import {
  dummyCalendarNutrition,
  dummyCalendarMeals,
  hasDataForDate,
} from '../../data/dummyCalendarData';
import {fetchNutritionSummary} from '../../api/api';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarDates, setCalendarDates] = useState<Array<Array<dayjs.Dayjs | null>>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayYearMonth, setDisplayYearMonth] = useState({
    year: selectedDate.format('YYYY'),
    month: selectedDate.format('MM'),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 영양소 요약 데이터 상태
  const [nutritionSummary, setNutritionSummary] = useState<{
    consumedCalories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    energy?: number;
    [key: string]: number | undefined;
  } | null>(null);

  // 목표 영양소 값 (더미 데이터)
  const goalNutrition = {
    calories: 2000,
    carbs: 250,
    protein: 80,
    fat: 60
  };

  // 선택된 날짜의 데이터
  const selectedDateStr = selectedDate.format('YYYY-MM-DD');
  // 식사 기록 데이터 상태
  const [mealRecords, setMealRecords] = useState<any[]>([]);
  // API 데이터가 있으면 사용하고, 없으면 더미 데이터 사용
  const hasData = nutritionSummary !== null || hasDataForDate(selectedDate);

  // 캘린더 데이터를 가져오는 함수 (영양소 요약 및 식사 기록)
  const getCalendarData = async (date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 날짜 포맷 변환 (YYYY.MM.DD -> YYYY-MM-DD)
      const formattedDate = date.replace(/\./g, '-');
      
      // 1. 영양소 요약 데이터 가져오기
      const nutritionResponse = await fetchNutritionSummary(formattedDate);
      if (nutritionResponse && nutritionResponse.data) {
        // energy 값을 consumedCalories로 사용
        const apiData = nutritionResponse.data;
        const formattedData = {
          ...apiData,
          consumedCalories: apiData.energy !== undefined ? apiData.energy : (apiData.consumedCalories || 0)
        };
        setNutritionSummary(formattedData);
        console.log('📊 캘린더 화면 - 영양소 요약 데이터 가져오기 성공:', formattedData);
      }
      
      // 2. 식사 기록 데이터 가져오기
      const { fetchMealRecords } = await import('../../api/api');
      try {
        const mealsResponse = await fetchMealRecords(formattedDate);
        
        // 전체 meal-records 데이터 상세 출력
        console.log('===== MEAL RECORDS API RESPONSE START =====');
        console.log('Date:', formattedDate);
        console.log('Raw API Response:', mealsResponse);
        console.log('Full meal-records data (formatted):', JSON.stringify(mealsResponse, null, 2));
        console.log('===== MEAL RECORDS API RESPONSE END =====');
        
        console.log('📊 캘린더 화면 - 식사 기록 API 응답:', mealsResponse);
        
        if (mealsResponse) {
          // HomeScreen과 동일한 방식으로 데이터 처리
          if (mealsResponse.meals && Array.isArray(mealsResponse.meals)) {
            // API 응답 데이터를 FoodCard에 맞는 형식으로 변환
            const formattedMeals = mealsResponse.meals.flatMap((mealGroup: any, index: number) => {
              // mealGroup이 유효한지 확인
              if (!mealGroup || !mealGroup.foods || !Array.isArray(mealGroup.foods)) {
                console.warn('유효하지 않은 mealGroup:', mealGroup);
                return [];
              }
              
              // mealType이 유효한지 확인
              const koreanMealType = mealGroup.mealType === 'BREAKFAST' ? '아침' : 
                                    mealGroup.mealType === 'LUNCH' ? '점심' : 
                                    mealGroup.mealType === 'DINNER' ? '저녁' : '간식';
              
              return mealGroup.foods.map((food: any, foodIndex: number) => {
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
                  foodName: food.fullName || food.name || '알 수 없는 음식',
                };
              }).filter(Boolean); // null 값 제거
            });
            
            console.log('변환된 데이터:', formattedMeals.length, '개의 식사');
            setMealRecords(formattedMeals);
          } else if (Array.isArray(mealsResponse)) {
            // 배열 형태로 온 경우 처리
            setMealRecords(mealsResponse);
            console.log('📊 캘린더 화면 - 식사 기록 가져오기 성공 (배열):', mealsResponse);
          } else if (mealsResponse.data && Array.isArray(mealsResponse.data)) {
            // data 객체 안에 배열이 있는 경우 처리
            setMealRecords(mealsResponse.data);
            console.log('📊 캘린더 화면 - 식사 기록 가져오기 성공 (data 객체):', mealsResponse.data);
          } else {
            console.warn('📊 식사 기록이 예상하지 않은 형식입니다:', mealsResponse);
            setMealRecords([]);
          }
        } else {
          console.log('📊 식사 기록이 없습니다.');
          setMealRecords([]);
        }
      } catch (mealError) {
        console.error('🚫 식사 기록 가져오기 오류:', mealError);
        // 식사 기록 오류 발생 시 더미 데이터 사용
        setMealRecords(dummyCalendarMeals[selectedDateStr] || []);
      }
    } catch (error) {
      console.error('🚫 캘린더 화면 - 데이터 가져오기 오류:', error);
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
      // 오류 발생 시 더미 데이터 사용
      const dummyData = dummyCalendarNutrition[selectedDateStr];
      if (dummyData) {
        setNutritionSummary({
          consumedCalories: dummyData.consumedCalories,
          carbohydrate: dummyData.nutrients.carbs.consumed,
          protein: dummyData.nutrients.protein.consumed,
          fat: dummyData.nutrients.fat.consumed
        });
      }
      setMealRecords(dummyCalendarMeals[selectedDateStr] || []);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 화면 진입 시 오늘 날짜의 데이터 가져오기
  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    getCalendarData(today);
  }, []);
  
  // 날짜 선택 시 데이터 가져오기
  useEffect(() => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    getCalendarData(formattedDate);
  }, [selectedDate]);

  // 캘린더 날짜 계산
  useEffect(() => {
    generateCalendarDates(
      parseInt(displayYearMonth.year),
      parseInt(displayYearMonth.month) - 1,
    );
  }, [displayYearMonth]);

  // 캘린더 날짜 생성 함수
  const generateCalendarDates = (year: number, month: number) => {
    const firstDayOfMonth = dayjs(new Date(year, month, 1));
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const dayOfWeek = firstDayOfMonth.day(); // 0: 일요일, 1: 월요일, ...

    // 달력에 표시할 날짜 배열 생성
    const calendarDays: Array<Array<dayjs.Dayjs | null>> = [];
    let week: Array<dayjs.Dayjs | null> = [];

    // 첫 주 시작 전 빈 칸 채우기
    const startDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 월요일부터 시작하도록 조정
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    // 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs(new Date(year, month, i));
      week.push(date);

      if (week.length === 7) {
        calendarDays.push(week);
        week = [];
      }
    }

    // 마지막 주 빈 칸 채우기
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendarDays.push(week);
    }

    setCalendarDates(calendarDays);
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // 모달 확인 버튼 핸들러
  const handleConfirmModal = (year: string, month: string) => {
    setDisplayYearMonth({year, month});
    setModalVisible(false);
  };

  // 식사 상세 화면으로 이동
  const navigateToMealDetails = (mealType: string) => {
    console.log(`식사 상세 화면으로 이동: 날짜=${selectedDate.format('YYYY.MM.DD')}, 식사 유형=${mealType}`);
    // @ts-ignore: 타입 정의 임시 처리
    navigation.navigate('MealDetails', {
      date: selectedDate.format('YYYY.MM.DD'),
      mealType: mealType,
    });
  };

  // 요일 배열
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <HeaderContent>
            <HeaderTitle>날짜선택</HeaderTitle>
            <YearMonthButton onPress={() => setModalVisible(true)}>
              <YearMonthText>
                {displayYearMonth.year}.{displayYearMonth.month}.
              </YearMonthText>
              <ArrowRight width={16} height={16} />
            </YearMonthButton>
          </HeaderContent>

          {/* 캘린더 영역 */}
          <CalendarContainer>
            <WeekdayRow>
              {weekdays.map((day, index) => (
                <WeekdayText key={index}>{day}</WeekdayText>
              ))}
            </WeekdayRow>
            <WeekdayDivider />

            {calendarDates.map((week, weekIndex) => (
              <WeekRow key={`week-${weekIndex}`}>
                {week.map((date, dateIndex) => {
                  if (!date) {
                    return <EmptyDateCell key={`empty-${dateIndex}`} />;
                  }

                  const isSelected =
                    date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD');
                  const isPast = date.isBefore(dayjs(), 'day');
                  const isFuture = date.isAfter(dayjs(), 'day');

                  return (
                    <DateCell
                      key={`date-${dateIndex}`}
                      onPress={() => handleDateSelect(date)}>
                      <DateCircle isSelected={isSelected}>
                        <DateText
                          isSelected={isSelected}
                          isPast={isPast}
                          isFuture={isFuture}>
                          {date.date()}
                        </DateText>
                      </DateCircle>
                    </DateCell>
                  );
                })}
              </WeekRow>
            ))}
            <WeekdayDivider />
          </CalendarContainer>
        </HeaderContainer>

        <ContentContainer>
          {isLoading ? (
            <LoadingContainer>
              <ActivityIndicator size="large" color="#FD384C" />
              <LoadingText>데이터를 불러오고 있어요...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          ) : hasData && nutritionSummary ? (
            <SummaryContainer>
              <SummaryHeader>
                <DateInfoText>{selectedDate.format('YYYY.MM.DD')}</DateInfoText>
              </SummaryHeader>

              <TotalIntakeText>총 섭취량</TotalIntakeText>
              <CalorieInfoContainer>
                <CalorieText>{(nutritionSummary.consumedCalories || 0).toFixed(1)}</CalorieText>
                <CalorieUnit>/ {goalNutrition.calories}kcal</CalorieUnit>
              </CalorieInfoContainer>

              <ProgressBarContainer>
                <ProgressBarBackground>
                  <ProgressBarFill width={(nutritionSummary.consumedCalories / goalNutrition.calories) * 100} />
                </ProgressBarBackground>
              </ProgressBarContainer>

              <NutrientProgressContainer>
                <ProgressBar
                  id={1}
                  label="탄수화물"
                  consumed={parseFloat((nutritionSummary.carbohydrate || 0).toFixed(1))}
                  goal={goalNutrition.carbs}
                  progressColor="#FD384C"
                  unit="g"
                />
                <ProgressBar
                  id={2}
                  label="단백질"
                  consumed={parseFloat((nutritionSummary.protein || 0).toFixed(1))}
                  goal={goalNutrition.protein}
                  progressColor="#D95B72"
                  unit="g"
                />
                <ProgressBar
                  id={3}
                  label="지방"
                  consumed={parseFloat((nutritionSummary.fat || 0).toFixed(1))}
                  goal={goalNutrition.fat}
                  progressColor="#FD9E38"
                  unit="g"
                />
              </NutrientProgressContainer>
            </SummaryContainer>
          ) : (
            <SummaryContainer>
              <NoDataMessage>해당 날짜에 등록된 데이터가 없어요.</NoDataMessage>
            </SummaryContainer>
          )}
          <SectionDivider />

          {/* 식단 기록 영역 */}
          <SectionContainer>
            <SectionTitle>{selectedDate.format('YYYY.MM.DD')} 식단 기록</SectionTitle>

            {mealRecords && mealRecords.length > 0 ? (
              <FoodCardsContainer>
                {mealRecords.map((meal: any, index: number) => {
                  return (
                    <FoodCardWrapper key={meal.id || `meal-${index}`}>
                      <FoodCard
                        id={index}
                        imageUrl={meal.imageUrl || 'https://via.placeholder.com/150'}
                        mealType={meal.mealType}
                        totalCalories={meal.totalCalories}
                        carbs={meal.carbs}
                        protein={meal.protein}
                        fat={meal.fat}
                        foodName={meal.foodName}
                        onPress={() => navigateToMealDetails(meal.mealType)}
                        isDeleteMode={false}
                      />
                    </FoodCardWrapper>
                  );
                })}
              </FoodCardsContainer>
            ) : (
              <NoFoodContainer>
                <NoFoodMessage>
                  해당 날짜에는 업로드 된 음식 사진이 없어요.
                </NoFoodMessage>
              </NoFoodContainer>
            )}
          </SectionContainer>
        </ContentContainer>
      </ScrollView>

      {/* 날짜 선택 모달 */}
      <DatePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmModal}
        title="날짜 선택"
        initialYear={displayYearMonth.year}
        initialMonth={displayYearMonth.month}
      />
    </Container>
  );
};

export default CalendarScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #FFFBFB;
`;

const HeaderContainer = styled.View`
  background-color: #E44F68;
  padding: 20px;
  padding-top: 60px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
  color: #FFFFFF;
`;

const YearMonthButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  padding: 8px 12px;
  border-radius: 20px;
`;

const YearMonthText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #333333;
  margin-right: 4px;
`;

const CalendarContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 20px;
`;

const WeekdayRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
`;

const WeekdayText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #FFFFFF;
  width: 30px;
  text-align: center;
`;

const WeekdayDivider = styled.View`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-vertical: 5px;
`;

const WeekRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const DateCell = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

const EmptyDateCell = styled.View`
  width: 30px;
  height: 30px;
`;

interface DateCircleProps {
  isSelected: boolean;
}

const DateCircle = styled.View<DateCircleProps>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: DateCircleProps) => (props.isSelected ? '#FFFFFF' : 'transparent')};
`;

interface DateTextProps {
  isSelected: boolean;
  isPast: boolean;
  isFuture: boolean;
}

const DateText = styled.Text<DateTextProps>`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: ${(props: DateTextProps) => {
    if (props.isSelected) return '#E44F68';
    if (props.isPast) return '#FFFFFF';
    if (props.isFuture) return '#8E8E8E';
    return '#FFFFFF';
  }};
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const SummaryContainer = styled.View`
  background-color: #FFFFFF;
  margin: -40px 0 20px;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.1);
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
  color: #8E8E8E;
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
  color: #E44F68;
`;

const CalorieUnit = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
  margin-left: 4px;
`;

const ProgressBarContainer = styled.View`
  margin-bottom: 20px;
`;

const ProgressBarBackground = styled.View`
  height: 10px;
  background-color: #F0F0F0;
  border-radius: 5px;
  overflow: hidden;
`;

interface ProgressBarFillProps {
  width: number;
}

const ProgressBarFill = styled.View<ProgressBarFillProps>`
  height: 100%;
  width: ${(props: ProgressBarFillProps) => Math.min(props.width, 100)}%;
  background-color: #E44F68;
  border-radius: 5px;
`;

const NutrientProgressContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const SectionContainer = styled.View`
  margin: 8px 0;
`;

const SectionTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
  margin-bottom: 16px;
`;

const FoodCardsContainer = styled.View`
  align-items: center;
  margin-bottom: 60px;
`;

const FoodCardWrapper = styled.View`
  margin-bottom: 16px;
`;

const NoDataMessage = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #8E8E8E;
  text-align: center;
  margin: 20px 0;
`;

const NoFoodContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 40px 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0,0,0,0.1);
`;

const NoFoodMessage = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #8E8E8E;
  text-align: center;
`;

const SectionDivider = styled.View`
  height: 8px;
  background-color: #E1E3E7;
  margin-vertical: 8px;
`;

const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const LoadingText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #8E8E8E;
  margin-top: 10px;
`;

const ErrorContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const ErrorText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #FD384C;
  text-align: center;
`;