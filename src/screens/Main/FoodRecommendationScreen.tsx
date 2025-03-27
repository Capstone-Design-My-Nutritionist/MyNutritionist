import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NutrientItem from '../../components/Nutrient/NutrientItem';
import { dummyFood } from '../../data/dummyFoodRecommendationData';

// 타입 정의
type RouteParams = {
  name: string;
  imageUrl: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  mealType?: string;
  nutrients: Record<string, string>;
};

const FoodRecommendationScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  
  // 실제 데이터는 route.params에서 가져오지만, 테스트를 위해 dummy 데이터도 사용
  const foodData = route.params || dummyFood;
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 영양소 총합 계산 (탄수화물 + 단백질 + 지방)
  const totalNutrients = foodData.carbs + foodData.protein + foodData.fat;
  
  // 각 영양소 비율 계산
  const carbsRatio = (foodData.carbs / totalNutrients) * 100;
  const proteinRatio = (foodData.protein / totalNutrients) * 100;
  const fatRatio = (foodData.fat / totalNutrients) * 100;

  // 유효한 영양소만 필터링 (값이 0이거나 빈 문자열이 아닌 것만)
  const validNutrients = Object.entries(foodData.nutrients).filter(
    ([_, value]) => value !== '0g' && value !== ''
  );

  return (
    <Container>
      {/* 상단바 */}
      <HeaderContainer>
        <BackButton onPress={handleGoBack}>
          <Icon name="arrow-back-ios" size={24} color="#731A22" />
        </BackButton>
        <HeaderTitle>식사메뉴 추천</HeaderTitle>
      </HeaderContainer>
      <HeaderDivider />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 음식 이미지 */}
        <FoodImage source={{ uri: foodData.imageUrl }} />

        {/* 음식 정보 카드 */}
        <FoodInfoCard>
          <FoodInfoHeader>
            <FoodName>{foodData.name}</FoodName>
            {foodData.mealType && <MealTypeTag>{foodData.mealType}</MealTypeTag>}
          </FoodInfoHeader>
          
          <ServingInfoRow>
            <ServingText>1인분</ServingText>
            <CalorieText>{foodData.kcal}kcal</CalorieText>
          </ServingInfoRow>

          {/* 탄단지 정보 */}
          <NutrientSummary>
            <NutrientRow>
              <NutrientDot color="#FD384C" />
              <NutrientLabel>탄수화물</NutrientLabel>
              <NutrientValue color="#FD384C">{foodData.carbs}g</NutrientValue>
            </NutrientRow>

            <NutrientRow>
              <NutrientDot color="#FD9E38" />
              <NutrientLabel>지방</NutrientLabel>
              <NutrientValue color="#FD9E38">{foodData.fat}g</NutrientValue>
            </NutrientRow>

            <NutrientRow>
              <NutrientDot color="#D95B72" />
              <NutrientLabel>단백질</NutrientLabel>
              <NutrientValue color="#D95B72">{foodData.protein}g</NutrientValue>
            </NutrientRow>
          </NutrientSummary>

          {/* 탄단지 프로그레스바 */}
          <NutrientProgressBar>
            <CarbsProgress width={carbsRatio} />
            <FatProgress width={fatRatio} />
            <ProteinProgress width={proteinRatio} />
          </NutrientProgressBar>
        </FoodInfoCard>
        <SectionDivider />


        {/* 영양소 상세 정보 */}
        <NutrientDetailContainer>
          {validNutrients.map(([name, value], index) => (
            <NutrientItem key={`nutrient-${index}`} name={name} value={value} />
          ))}
        </NutrientDetailContainer>

        {/* 하단 여백 */}
        <BottomSpacer />
      </ScrollView>
    </Container>
  );
};

export default FoodRecommendationScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #FFFBFB;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 60px;
  position: relative;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  top: 60px;
`;

const HeaderTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
`;

const HeaderDivider = styled.View`
  height: 1px;
  width: 100%;
  background-color: #731A22;
`;

const FoodImage = styled.Image`
  width: 100%;
  height: 300px;
  resize-mode: cover;
`;

const FoodInfoCard = styled.View`
  background-color: #FFFFFF;
  margin-top: -20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.1);
`;

const FoodInfoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FoodName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
  color: #111111;
`;

const MealTypeTag = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 12px;
  color: #FFFFFF;
  background-color: #E44F68;
  padding: 4px 8px;
  border-radius: 12px;
`;

const ServingInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ServingText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
`;

const CalorieText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #E44F68;
`;

const NutrientSummary = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  
`;

const NutrientSummaryText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #111111;
`;

interface ColorProps {
  color: string;
}

const NutrientDot = styled.View<ColorProps>`
  width: 8px;
  height: 8px;
  background-color: ${(props: ColorProps) => props.color};
  border-radius: 2px;
  margin-left: 6px;
`;

interface WidthProps {
  width: number;
}

const NutrientProgressBar = styled.View`
  height: 10px;
  flex-direction: row;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const CarbsProgress = styled.View<WidthProps>`
  height: 100%;
  width: ${(props: WidthProps) => props.width}%;
  background-color: #FD384C;
`;

const FatProgress = styled.View<WidthProps>`
  height: 100%;
  width: ${(props: WidthProps) => props.width}%;
  background-color: #FD9E38;
`;

const ProteinProgress = styled.View<WidthProps>`
  height: 100%;
  width: ${(props: WidthProps) => props.width}%;
  background-color: #D95B72;
`;

const SectionDivider = styled.View`
  height: 1px;
  width: 100%;
  background-color: #731A22;
  opacity: 0.5;
`;

const NutrientDetailContainer = styled.View`
  align-items: center;
  padding: 10px 20px;
`;

const BottomSpacer = styled.View`
  height: 100px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px; 
`;

const NutrientLabel = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #111111;
  margin-left: 4px;
`;

const NutrientValue = styled.Text<{ color: string }>`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: ${(props: { color: string }) => props.color};
  margin-left: 4px;
`;