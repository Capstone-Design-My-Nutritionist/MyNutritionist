import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NutrientItem from '../../components/Nutrient/NutrientItem';
import { getMealRecordById, getMealRecordByDateAndType, dummyMealRecord } from '../../data/dummyMealRecordData';

// 타입 정의
type RouteParams = {
  mealId?: number;
  date?: string;
  mealType?: string;
};

const MealRecordsScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  
  // 라우트 파라미터에서 필요한 정보 추출
  const { mealId, date, mealType } = route.params || {};
  
  // 식사 기록 데이터 가져오기 (ID 또는 날짜와 식사 타입으로)
  let mealRecord;
  if (mealId) {
    mealRecord = getMealRecordById(mealId);
  } else if (date && mealType) {
    mealRecord = getMealRecordByDateAndType(date, mealType);
  }
  
  // 데이터가 없을 경우 기본 더미 데이터 사용 (테스트용)
  const mealData = mealRecord ? {
    date: mealRecord.date,
    mealType: mealRecord.mealType,
    imageUrl: mealRecord.mainFood.imageUrl,
    foodName: mealRecord.mainFood.name,
    totalCalories: mealRecord.mainFood.kcal,
    carbs: mealRecord.mainFood.carbs,
    protein: mealRecord.mainFood.protein,
    fat: mealRecord.mainFood.fat,
    servingSize: mealRecord.mainFood.serving,
    nutrients: mealRecord.mainFood.nutrients,
    additionalFoods: mealRecord.additionalFoods.map(food => ({
      name: food.name,
      servingSize: food.serving,
      actualServing: food.actualAmount,
      calories: food.kcal,
      nutrients: food.nutrients
    }))
  } : {
    date: dummyMealRecord.date,
    mealType: dummyMealRecord.mealType,
    imageUrl: dummyMealRecord.mainFood.imageUrl,
    foodName: dummyMealRecord.mainFood.name,
    totalCalories: dummyMealRecord.mainFood.kcal,
    carbs: dummyMealRecord.mainFood.carbs,
    protein: dummyMealRecord.mainFood.protein,
    fat: dummyMealRecord.mainFood.fat,
    servingSize: dummyMealRecord.mainFood.serving,
    nutrients: dummyMealRecord.mainFood.nutrients,
    additionalFoods: dummyMealRecord.additionalFoods.map(food => ({
      name: food.name,
      servingSize: food.serving,
      actualServing: food.actualAmount,
      calories: food.kcal,
      nutrients: food.nutrients
    }))
  };
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 영양소 총합 계산 (탄수화물 + 단백질 + 지방)
  const totalNutrients = mealData.carbs + mealData.protein + mealData.fat;
  
  // 각 영양소 비율 계산
  const carbsRatio = (mealData.carbs / totalNutrients) * 100;
  const proteinRatio = (mealData.protein / totalNutrients) * 100;
  const fatRatio = (mealData.fat / totalNutrients) * 100;

  // 유효한 영양소만 필터링 (값이 0이거나 빈 문자열이 아닌 것만)
  const validNutrients = Object.entries(mealData.nutrients).filter(
    ([_, value]) => value !== '0g' && value !== ''
  );

  return (
    <Container>
      {/* 상단바 */}
      <HeaderContainer>
        <BackButton onPress={handleGoBack}>
          <Icon name="arrow-back-ios" size={24} color="#731A22" />
        </BackButton>
        <HeaderTitle>{`${mealData.date} - ${mealData.mealType}식사`}</HeaderTitle>
      </HeaderContainer>
      <HeaderDivider />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 음식 이미지 */}
        <FoodImage source={{ uri: mealData.imageUrl }} />

        {/* 음식 정보 카드 */}
        <FoodInfoCard>
          <FoodInfoHeader>
            <FoodName>{mealData.foodName}</FoodName>
            <MealTypeTag>{mealData.mealType}</MealTypeTag>
          </FoodInfoHeader>
          
          <ServingInfoRow>
            <ServingText>{mealData.servingSize}</ServingText>
            <CalorieText>{mealData.totalCalories}kcal</CalorieText>
          </ServingInfoRow>

          {/* 탄단지 정보 */}
          <NutrientSummary>
            <NutrientRow>
              <NutrientDot color="#FD384C" />
              <NutrientLabel>탄수화물</NutrientLabel>
              <NutrientValue color="#FD384C">{mealData.carbs}g</NutrientValue>
            </NutrientRow>

            <NutrientRow>
              <NutrientDot color="#FD9E38" />
              <NutrientLabel>지방</NutrientLabel>
              <NutrientValue color="#FD9E38">{mealData.fat}g</NutrientValue>
            </NutrientRow>

            <NutrientRow>
              <NutrientDot color="#D95B72" />
              <NutrientLabel>단백질</NutrientLabel>
              <NutrientValue color="#D95B72">{mealData.protein}g</NutrientValue>
            </NutrientRow>
          </NutrientSummary>

          {/* 탄단지 프로그레스바 */}
          <NutrientProgressBar>
            <CarbsProgress width={carbsRatio} />
            <FatProgress width={fatRatio} />
            <ProteinProgress width={proteinRatio} />
          </NutrientProgressBar>
        </FoodInfoCard>

        {/* 영양소 상세 정보 */}
        <NutrientDetailContainer>
          {validNutrients.map(([name, value], index) => (
            <NutrientItem key={`nutrient-${index}`} name={name} value={value} />
          ))}
        </NutrientDetailContainer>

        {/* 추가 음식 정보 */}
        {mealData.additionalFoods && mealData.additionalFoods.length > 0 && (
          <>
            {mealData.additionalFoods.map((food, foodIndex) => {
              // 유효한 영양소만 필터링
              const validAdditionalNutrients = Object.entries(food.nutrients).filter(
                ([_, value]) => value !== '0g' && value !== ''
              );
              
              return (
                <React.Fragment key={`additional-food-${foodIndex}`}>
                  <SectionDivider />
                  <NutrientDetailContainer>
                    <AdditionalFoodHeader>
                      <AdditionalFoodName>{food.name}</AdditionalFoodName>
                      <AdditionalFoodCalories>{food.calories}kcal</AdditionalFoodCalories>
                    </AdditionalFoodHeader>
                    
                    <ServingInfoWrapper>
                      <ServingInfoRow>
                        <ServingText>기본 {food.servingSize}</ServingText>
                        <ActualServingText>실제 섭취량: {food.actualServing}</ActualServingText>
                      </ServingInfoRow>
                    </ServingInfoWrapper>

                    {validAdditionalNutrients.map(([name, value], index) => (
                      <NutrientItem key={`additional-nutrient-${foodIndex}-${index}`} name={name} value={value} />
                    ))}
                  </NutrientDetailContainer>
                </React.Fragment>
              );
            })}
          </>
        )}

        {/* 하단 여백 */}
        <BottomSpacer />
      </ScrollView>
    </Container>
  );
};

export default MealRecordsScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #FFF8F8;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 60px;
  position: relative;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-color: #E0E0E0;
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
  background-color: #E0E0E0;
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
  flex-direction: column;
  justify-content: space-between;
  align-items:left;
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
  height: 8px;
  background-color: #E0E0E0;

`;

const NutrientDetailContainer = styled.View`
  align-items: center;
  padding: 10px 20px;
  background-color: #fefefe;
`;

const AdditionalFoodHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  width: 350px;
`;

const AdditionalFoodName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
`;

const AdditionalFoodCalories = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #E44F68;
`;

const ActualServingText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #D95B72;
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

const ServingInfoWrapper = styled.View`
  width: 100%;
  max-width: 350px;
  align-self: flex-start;
  padding: 0px 10px;
`;