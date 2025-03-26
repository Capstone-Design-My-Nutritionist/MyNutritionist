import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
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

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarDates, setCalendarDates] = useState<Array<Array<dayjs.Dayjs | null>>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayYearMonth, setDisplayYearMonth] = useState({
    year: selectedDate.format('YYYY'),
    month: selectedDate.format('MM'),
  });

  // 선택된 날짜의 데이터
  const selectedDateStr = selectedDate.format('YYYY-MM-DD');
  const nutritionData = dummyCalendarNutrition[selectedDateStr];
  const mealsData = dummyCalendarMeals[selectedDateStr] || [];
  const hasData = hasDataForDate(selectedDate);

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
  const navigateToMealDetails = (mealId: number) => {
    // @ts-ignore: 타입 정의 임시 처리
    navigation.navigate('MealDetails', {
      date: selectedDate.format('YYYY.MM.DD'),
      mealId,
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
          {/* 총 섭취량 요약 블럭 */}
          {hasData ? (
            <SummaryContainer>
              <SummaryHeader>
                <DateInfoText>{selectedDate.format('YYYY.MM.DD')}</DateInfoText>
              </SummaryHeader>

              <TotalIntakeText>총 섭취량</TotalIntakeText>
              <CalorieInfoContainer>
                <CalorieText>{nutritionData.consumedCalories}</CalorieText>
                <CalorieUnit>/ {nutritionData.totalCalories}kcal</CalorieUnit>
              </CalorieInfoContainer>

              <ProgressBarContainer>
                <ProgressBarBackground>
                  <ProgressBarFill width={(nutritionData.consumedCalories / nutritionData.totalCalories) * 100} />
                </ProgressBarBackground>
              </ProgressBarContainer>

              <NutrientProgressContainer>
                <ProgressBar
                  id={1}
                  label="탄수화물"
                  consumed={nutritionData.nutrients.carbs.consumed}
                  goal={nutritionData.nutrients.carbs.goal}
                  progressColor="#FD384C"
                  unit="g"
                />
                <ProgressBar
                  id={2}
                  label="단백질"
                  consumed={nutritionData.nutrients.protein.consumed}
                  goal={nutritionData.nutrients.protein.goal}
                  progressColor="#D95B72"
                  unit="g"
                />
                <ProgressBar
                  id={3}
                  label="지방"
                  consumed={nutritionData.nutrients.fat.consumed}
                  goal={nutritionData.nutrients.fat.goal}
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

          {/* 식단 기록 영역 */}
          <SectionContainer>
            <SectionTitle>{selectedDate.format('YYYY.MM.DD')} 식단 기록</SectionTitle>

            {mealsData.length > 0 ? (
              <FoodCardsContainer>
                {mealsData.map(meal => (
                  <FoodCardWrapper key={meal.id}>
                    <FoodCard
                      id={meal.id}
                      imageUrl={meal.imageUrl}
                      mealType={meal.mealType}
                      totalCalories={meal.totalCalories}
                      carbs={meal.carbs}
                      protein={meal.protein}
                      fat={meal.fat}
                      onPress={() => navigateToMealDetails(meal.id)}
                    />
                  </FoodCardWrapper>
                ))}
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
  font-size: 9px;
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
  padding: 30px 0;
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
