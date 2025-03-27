// src/screens/Nutrition/NutritionDetailsScreen.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import ProgressBar from '../../components/Progress/ProgressBar';

type RouteParams = {
  date: string;
};


const NutritionDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const selectedDate = route.params.date || '2025.03.25';


  // 임시 데이터
  const totalCalories = 2300;
  const consumedCalories = 1080;

  const nutrients = {
    carbs: { consumed: 14, goal: 60 },
    protein: { consumed: 45.1, goal: 50 },
    fat: { consumed: 83.4, goal: 100 },
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>{selectedDate} 섭취 영양소 상세</Title>

        <CalorieSection>
          <SectionTitle>총 섭취 칼로리</SectionTitle>
          <CalorieText>{consumedCalories} / {totalCalories} kcal</CalorieText>
          <ProgressBarContainer>
            <ProgressBarBackground>
              <ProgressBarFill width={(consumedCalories / totalCalories) * 100} />
            </ProgressBarBackground>
          </ProgressBarContainer>
        </CalorieSection>

        <SectionTitle>영양소 상세</SectionTitle>

        <ProgressBar
          id={1}
          label="탄수화물"
          consumed={nutrients.carbs.consumed}
          goal={nutrients.carbs.goal}
          progressColor="#FD384C"
          unit="g"
        />
        <ProgressBar
          id={2}
          label="단백질"
          consumed={nutrients.protein.consumed}
          goal={nutrients.protein.goal}
          progressColor="#D95B72"
          unit="g"
        />
        <ProgressBar
          id={3}
          label="지방"
          consumed={nutrients.fat.consumed}
          goal={nutrients.fat.goal}
          progressColor="#FD9E38"
          unit="g"
        />

        <BottomSpacer />
      </ScrollView>
    </Container>
  );
};

export default NutritionDetailsScreen;

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const Title = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
  margin-bottom: 20px;
  color: #111111;
`;

const SectionTitle = styled.Text`
  font-family: 'Pretendard-SemiBold';
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #111111;
`;

const CalorieSection = styled.View`
  margin-bottom: 20px;
`;

const CalorieText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #E44F68;
`;

const ProgressBarContainer = styled.View`
  margin-top: 10px;
`;

const ProgressBarBackground = styled.View`
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressBarFill = styled.View<{ width: number }>`
  width: ${(props: { width: number }) => Math.min(props.width, 100)}%;
  height: 100%;
  background-color: #E44F68;
  border-radius: 5px;
`;

const BottomSpacer = styled.View`
  height: 100px;
`;