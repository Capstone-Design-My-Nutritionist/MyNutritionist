// src/screens/Main/NutritionDetailsScreen.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ProgressBar from '../../components/Progress/ProgressBar';
import { dummyNutritionData } from '../../data/dummyNutritionDetailData';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RouteParams = {
  date: string;
};

const NutritionDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  const selectedDate = route.params?.date || '2025.03.27';

  const { totalCalories, consumedCalories, nutrients } = dummyNutritionData;

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 영양소 그리드 렌더링 (3개씩 5줄)
  const renderNutrientGrid = () => {
    const rows = [];
    for (let i = 0; i < nutrients.length; i += 3) {
      const rowItems = nutrients.slice(i, i + 3);
      rows.push(
        <NutrientRow key={`row-${i}`}>
          {rowItems.map((nutrient, index) => (
            <NutrientItem key={`nutrient-${i + index}`}>
              <ProgressBar
                id={i + index}
                label={nutrient.label}
                consumed={nutrient.consumed}
                goal={nutrient.goal}
                progressColor={nutrient.progressColor}
                unit={nutrient.unit}
              />
            </NutrientItem>
          ))}
        </NutrientRow>
      );
    }
    return rows;
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
      <HeaderBackground>
        <HeaderContent>
          <DateText>{selectedDate}</DateText>
          <SubText>에 섭취했던 영양소 정보에요.</SubText>
        </HeaderContent>
      </HeaderBackground>

      
        <ContentContainer>
          <SummaryContainer>
            <SectionTitle>총 섭취량</SectionTitle>
            <CalorieInfoContainer>
              <CalorieText>{consumedCalories}</CalorieText>
              <CalorieUnit>/ {totalCalories}kcal</CalorieUnit>
            </CalorieInfoContainer>
            
            <ProgressBarContainer>
              <ProgressBarBackground>
                <ProgressBarFill 
                  width={(consumedCalories / totalCalories) * 100} 
                />
              </ProgressBarBackground>
            </ProgressBarContainer>

            <NutrientGridContainer>
              {renderNutrientGrid()}
            </NutrientGridContainer>
          </SummaryContainer>
        </ContentContainer>
      

      <BackButtonContainer>
        <BackButton onPress={handleGoBack}>
          <BackButtonText>뒤로가기</BackButtonText>
        </BackButton>
      </BackButtonContainer>
      </ScrollView>
    </Container>
  );
};

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #FFFBFB;
`;

const HeaderBackground = styled.View`
  background-color: #E44F68;
  padding: 20px;
  padding-top: 100px;
  height: 260px;
`;

const HeaderContent = styled.View`
  align-items: left;
`;

const DateText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-size: 20px;
  color: #FFFFFF;
  margin-bottom: 4px;
`;

const SubText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #FFFFFF;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const SummaryContainer = styled.View`
  background-color: #FFFFFF;
  margin-top: -80px;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.1);
`;

const SectionTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #333333;
  margin-bottom: 10px;
`;

const CalorieInfoContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 10px;
`;

const CalorieText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 24px;
  color: #333333;
`;

const CalorieUnit = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
  margin-left: 5px;
`;

const ProgressBarContainer = styled.View`
  margin-bottom: 20px;
`;

const ProgressBarBackground = styled.View`
  height: 8px;
  background-color: #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.View<{ width: number }>`
  height: 100%;
  width: ${(props: { width: number }) => props.width}%;
  background-color: #E44F68;
  border-radius: 4px;
`;

const NutrientGridContainer = styled.View`
  margin-top: 20px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const NutrientItem = styled.View`
  flex: 1;
  margin-horizontal: 5px;
`;

const BackButtonContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  background-color: #E44F68;
  padding: 15px 30px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  width: 80%;
`;

const BackButtonText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #FFFFFF;
`;

export default NutritionDetailsScreen;