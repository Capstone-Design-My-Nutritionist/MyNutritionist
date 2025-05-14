import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { NUTRIENT_NAMES, NUTRIENT_UNITS } from '../../data/constants';

interface NutrientInfo {
  [key: string]: number;
}

interface FoodCardProps {
  foodName: string;
  imageUri?: string;
  calories: number;
  nutrients: NutrientInfo;
  servingSize?: string;
  mealType?: string;
  timestamp?: string;
  onPress?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  foodName,
  imageUri,
  calories,
  nutrients,
  servingSize = '1인분',
  mealType,
  timestamp,
  onPress,
}) => {
  // 주요 영양소 추출 (탄수화물, 단백질, 지방)
  const carbs = nutrients.carbohydrate || 0;
  const protein = nutrients.protein || 0;
  const fat = nutrients.fat || 0;

  // 영양소 단위 포맷팅 함수
  const formatNutrient = (key: string, value: number): string => {
    if (key === 'calories') return `${Math.round(value)} ${NUTRIENT_UNITS[key]}`;
    
    const unit = NUTRIENT_UNITS[key as keyof typeof NUTRIENT_UNITS] || 'g';
    return `${Math.round(value * 10) / 10} ${unit}`;
  };

  return (
    <Shadow
      distance={4}
      offset={[0, 2]}
      startColor="rgba(0, 0, 0, 0.05)"
      containerStyle={{ borderRadius: 12, marginBottom: 16 }}>
      <CardContainer onPress={onPress}>
        <CardContent>
          <LeftContent>
            <FoodName>{foodName}</FoodName>
            
            {(mealType || timestamp) && (
              <InfoRow>
                {mealType && <MealType>{mealType}</MealType>}
                {timestamp && <Timestamp>{timestamp}</Timestamp>}
              </InfoRow>
            )}
            
            <ServingInfo>{servingSize}</ServingInfo>
            
            <CaloriesInfo>
              {formatNutrient('calories', calories)}
            </CaloriesInfo>
            
            <NutrientRow>
              <NutrientItem>
                <NutrientLabel>탄수화물</NutrientLabel>
                <NutrientValue>{formatNutrient('carbohydrate', carbs)}</NutrientValue>
              </NutrientItem>
              
              <NutrientItem>
                <NutrientLabel>단백질</NutrientLabel>
                <NutrientValue>{formatNutrient('protein', protein)}</NutrientValue>
              </NutrientItem>
              
              <NutrientItem>
                <NutrientLabel>지방</NutrientLabel>
                <NutrientValue>{formatNutrient('fat', fat)}</NutrientValue>
              </NutrientItem>
            </NutrientRow>
          </LeftContent>
          
          {imageUri && (
            <FoodImage
              source={{ uri: imageUri }}
              resizeMode="cover"
            />
          )}
        </CardContent>
      </CardContainer>
    </Shadow>
  );
};

export default FoodCard;

const CardContainer = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
`;

const CardContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const LeftContent = styled.View`
  flex: 1;
  margin-right: 12px;
`;

const FoodName = styled.Text`
  font-size: 16px;
  font-family: 'Pretendard-Bold';
  color: #000;
  margin-bottom: 4px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const MealType = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Medium';
  color: #d95b72;
  background-color: rgba(217, 91, 114, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
`;

const Timestamp = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Regular';
  color: #666;
`;

const ServingInfo = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Regular';
  color: #666;
  margin-bottom: 8px;
`;

const CaloriesInfo = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #d95b72;
  margin-bottom: 12px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const NutrientItem = styled.View`
  align-items: center;
`;

const NutrientLabel = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Regular';
  color: #666;
  margin-bottom: 2px;
`;

const NutrientValue = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: #000;
`;

const FoodImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;
