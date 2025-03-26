import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import ProgressBar from '../../components/Progress/ProgressBar';
import FoodCard, {FoodCardProps} from '../../components/Card/FoodCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Shadow } from 'react-native-shadow-2';
import ArrowLeft from '../../../assets/images/arrow-left.svg';
import ArrowRight from '../../../assets/images/arrow-right.svg';
import { tempUserData, tempMeals, tempRecommendations } from '../../data/dummyHomeData';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [weekDates, setWeekDates] = useState<dayjs.Dayjs[]>([]);
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  
  // 일주일 날짜 계산 (오늘 기준 전 3일, 후 3일)
  useEffect(() => {
    const today = dayjs();
    const dates = [];
    
    for (let i = -3; i <= 3; i++) {
      dates.push(today.add(i, 'day'));
    }
    
    setWeekDates(dates);
  }, []);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    // 여기에 선택된 날짜에 따른 데이터 로딩 로직 추가
  };

  // 추천 메뉴 이전 버튼 핸들러
  const handlePrevRecommendation = () => {
    setCurrentRecommendationIndex(prev => 
      prev === 0 ? tempRecommendations.length - 1 : prev - 1
    );
  };

  // 추천 메뉴 다음 버튼 핸들러
  const handleNextRecommendation = () => {
    setCurrentRecommendationIndex(prev => 
      prev === tempRecommendations.length - 1 ? 0 : prev + 1
    );
  };

  // 영양 상세 화면으로 이동
  const navigateToNutritionDetails = () => {
    // @ts-ignore: 타입 정의 임시 처리
    navigation.navigate('NutritionDetails', { 
      date: selectedDate.format('YYYY.MM.DD') 
    });
  };

  // 현재 표시할 추천 메뉴
  const currentRecommendation = tempRecommendations[currentRecommendationIndex];

  return (
    <Container>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상단 환영 메시지 + 배경 영역 */}

        <HeaderContainer>
          <WelcomeText>{tempUserData.name} 님 안녕하세요!</WelcomeText>
          <SubText>제가 당신의 개인 영양사가 되어드릴게요!</SubText>
          <DividerLine />
          {/* 일주일 날짜 캘린더 */}
          <DateContainer>
            {weekDates.map((date, index) => {
              const isSelected = date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD');
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
              <CalorieText>{tempUserData.consumedCalories}</CalorieText>
              <CalorieUnit>/ {tempUserData.totalCalories}kcal</CalorieUnit>
            </CalorieInfoContainer>
            
            <ProgressBarContainer>
              <ProgressBarBackground>
                <ProgressBarFill 
                  width={(tempUserData.consumedCalories / tempUserData.totalCalories) * 100} 
                />
              </ProgressBarBackground>
            </ProgressBarContainer>
            
            <NutrientProgressContainer>
              <ProgressBar 
                id={1}
                label="탄수화물" 
                consumed={tempUserData.nutrients.carbs.consumed} 
                goal={tempUserData.nutrients.carbs.goal} 
                progressColor="#FD384C"
                unit="g"
              />
              <ProgressBar 
                id={2}
                label="단백질" 
                consumed={tempUserData.nutrients.protein.consumed} 
                goal={tempUserData.nutrients.protein.goal} 
                progressColor="#D95B72"
                unit="g"
              />
              <ProgressBar 
                id={3}
                label="지방" 
                consumed={tempUserData.nutrients.fat.consumed} 
                goal={tempUserData.nutrients.fat.goal} 
                progressColor="#FD9E38"
                unit="g"
              />
            </NutrientProgressContainer>
          </SummaryContainer>
      
        {/* 오늘 섭취한 음식 영역 */}
        <SectionContainer>
          <SectionTitle>오늘 섭취한 음식</SectionTitle>
          
          {tempMeals.length > 0 ? (
            <FoodCardsContainer>
              {tempMeals.map((meal) => (
                <FoodCardWrapper key={meal.id}>
                  <FoodCard
                    id={meal.id}
                    imageUrl={meal.imageUrl}
                    mealType={meal.mealType}
                    totalCalories={meal.totalCalories}
                    carbs={meal.carbs}
                    protein={meal.protein}
                    fat={meal.fat}
                    onPress={() => {
                      // 식사 상세 화면으로 이동하는 로직
                    }}
                  />
                </FoodCardWrapper>
              ))}
            </FoodCardsContainer>
          ) : (
            <EmptyFoodContainer>
              <EmptyFoodText>
                오늘은 어떤 식사를 하셨나요? 사진을 업로드해주세요.
              </EmptyFoodText>
            </EmptyFoodContainer>
          )}
        </SectionContainer>

        {/* 식사 메뉴 추천 영역 */}
        <SectionContainer>
          <SectionTitle>식사 메뉴 추천</SectionTitle>

          {tempRecommendations.length > 0 ? (
            <RecommendationContainer>
              <ArrowButton onPress={handlePrevRecommendation}>
                <ArrowLeft />
              </ArrowButton>

              <RecommendationCard>
                <RecommendationImage
                  source={{ uri: currentRecommendation.imageUrl }}
                  resizeMode="cover"
                />
                <RecommendationInfo>
                  <RecommendationName>{currentRecommendation.name}</RecommendationName>
                  <RecommendationCalories>{currentRecommendation.calories} kcal</RecommendationCalories>

                  <NutrientRow>
                    <NutrientLabel>탄수화물</NutrientLabel>
                    <NutrientValue color="#FD384C">{currentRecommendation.carbs}g</NutrientValue>
                  </NutrientRow>
                  <NutrientRow>
                    <NutrientLabel>단백질</NutrientLabel>
                    <NutrientValue color="#D95B72">{currentRecommendation.protein}g</NutrientValue>
                  </NutrientRow>
                  <NutrientRow>
                    <NutrientLabel>지방</NutrientLabel>
                    <NutrientValue color="#FD9E38">{currentRecommendation.fat}g</NutrientValue>
                  </NutrientRow>
                </RecommendationInfo>
              </RecommendationCard>

              <ArrowButton onPress={handleNextRecommendation}>
                <ArrowRight />
              </ArrowButton>
            </RecommendationContainer>
          ) : (
            <EmptyRecommendContainer>
              <EmptyRecommendText>
                설문조사에 참여하셔야 음식을 추천드릴 수 있어요
              </EmptyRecommendText>
            </EmptyRecommendContainer>
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
  background-color: #FFFBFB;
`;

const HeaderContainer = styled.View`
  background-color: #E44F68;
  height: 285px;
  width: 100%;
  padding: 20px;
  padding-top: 60px;
  align-items: left;
`;

const WelcomeText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-size: 20px;
  color: #FFFFFF;
  margin-bottom: 8px;
`;

const SubText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #FFFFFF;
  margin-bottom: 30px;
`;

const DividerLine = styled.View`
  height: 1px;
  width: 100%;
  background-color: #FFFFFF;
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
  width: 40px;
`;

const DayText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-size: 14px;
  color: #FFFFFF;
  margin-bottom: 8px;
`;

const DateCircle = styled.View<{isSelected: boolean}>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${(props: {isSelected: boolean}) => props.isSelected ? '#FFFFFF' : 'transparent'};
  align-items: center;
  justify-content: center;
`;

const DateText = styled.Text<{isSelected: boolean}>`
  font-family: 'Pretendard-ExtraBold';
  font-size: 14px;
  color: ${(props: {isSelected: boolean}) => props.isSelected ? '#E44F68' : '#FFFFFF'};
`;

const SummaryContainer = styled.View`
  background-color: #FFFFFF;
  margin: -40px 20px 0;
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

const DetailButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const DetailText = styled.Text`
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

const ProgressBarFill = styled.View<{width: number}>`
  height: 100%;
  width: ${(props: {width: number}) => Math.min(props.width, 100)}%;
  background-color: #E44F68;
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

const SectionTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
  margin-bottom: 16px;
`;

const FoodCardsContainer = styled.View`
  align-items: center;
`;

const FoodCardWrapper = styled.View`
  margin-bottom: 16px;
`;

const EmptyFoodContainer = styled.View`
  height: 120px;
  background-color: #F8F8F8;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyFoodText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
  text-align: center;
`;

const RecommendationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF; 
  border-radius: 16px; 
  border: 1px solid rgba(0,0,0,0.1);
`;  

const ArrowButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 6px;
`;

const RecommendationCard = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 12px 6px;
  flex-direction: row;
  justify-content: space-between;
`;

const RecommendationImage = styled.Image`
  width: 140px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid #111111;
`;

const RecommendationInfo = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: space-between;
`;

const RecommendationName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #111111;
`;

const RecommendationCalories = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #E44F68;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
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
  background-color: #F8F8F8;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyRecommendText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
  text-align: center;
`;
export default HomeScreen;
