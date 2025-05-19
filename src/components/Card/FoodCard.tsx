import React from 'react';
import styled from 'styled-components/native';
import {Shadow} from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface FoodCardProps {
  id: number;
  imageUrl: string;
  mealType: string;
  totalCalories: number;
  carbs: number;
  protein: number;
  fat: number;
  onPress?: () => void;
  isDeleteMode?: boolean;
  foodName?: string;
  onDeletePress?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  imageUrl,
  mealType,
  totalCalories,
  carbs,
  protein,
  fat,
  onPress,
  isDeleteMode = false,
  foodName,
  onDeletePress,
}) => {
  const totalNutrients = carbs + protein + fat;

  return (
    <Shadow
      distance={5}
      startColor="rgba(0, 0, 0, 0.05)"
      offset={[0, 0.5]}
      style={{borderRadius: 12}}>
      <CardContainer isDeleteMode={isDeleteMode} onPress={isDeleteMode ? onDeletePress : onPress}>
        <FoodImage source={{uri: imageUrl}} resizeMode="cover" />
        <InfoContainer>
          <TextBox>
            <Header>
              <MealType>{mealType}</MealType>
              {isDeleteMode ? (
                <DeleteIndicator>
                  <Icon name="delete-outline" size={16} color="#D95B72" />
                  <DeleteText>삭제하기</DeleteText>
                </DeleteIndicator>
              ) : (
                <DetailButton onPress={onPress}>
                  <DetailText>자세히</DetailText>
                  <Icon name="chevron-right" size={14} color="#8E8E8E" />
                </DetailButton>
              )}
            </Header>


            <TotalCalories>
              <TotalText>총 섭취량</TotalText>
              <CalorieText>{totalCalories.toFixed(1)}kcal</CalorieText>
            </TotalCalories>

            <NutritionRow>
              <Dot color="#FD384C" />
              <NutritionText>탄수화물</NutritionText>
              <ValueText color="#FD384C">{carbs.toFixed(1)}g</ValueText>
            </NutritionRow>
            <NutritionRow>
              <Dot color="#D95B72" />
              <NutritionText>단백질</NutritionText>
              <ValueText color="#D95B72">{protein.toFixed(1)}g</ValueText>
            </NutritionRow>
            <NutritionRow>
              <Dot color="#FD9E38" />
              <NutritionText>지방</NutritionText>
              <ValueText color="#FD9E38">{fat.toFixed(1)}g</ValueText>
            </NutritionRow>

            <ProgressBar>
              <Progress
                color="#FD384C"
                width={(carbs / totalNutrients) * 100}
              />
              <Progress
                color="#D95B72"
                width={(protein / totalNutrients) * 100}
              />
              <Progress color="#FD9E38" width={(fat / totalNutrients) * 100} />
            </ProgressBar>
          </TextBox>
        </InfoContainer>
      </CardContainer>
    </Shadow>
  );
};

export default FoodCard;

const CardContainer = styled.TouchableOpacity<{isDeleteMode?: boolean}>`
  flex-direction: row;
  background-color: ${(props: {isDeleteMode?: boolean}) => props.isDeleteMode ? '#FFF8F8' : 'white'};
  border-radius: 16px;
  padding: 10px;
  width: 360px;
  align-items: center;
  border: ${(props: {isDeleteMode?: boolean}) => props.isDeleteMode ? '1px solid #D95B72' : 'none'};
`;

const FoodImage = styled.Image`
  width: 140px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid #111111;
`;

const InfoContainer = styled.View`
  width: 340px;
  height: 120px;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const MealType = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: #731a22;
  flex: 1;
`;

const DetailButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const DetailText = styled.Text`
  font-size: 12px;
  color: #8E8E8E;
  margin-right: 2px;
`;

const DeleteIndicator = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DeleteText = styled.Text`
  font-size: 12px;
  color: #D95B72;
  margin-left: 2px;
`;

const TextBox = styled.View`
  width: 188px;
  height: 114px;
  flex-direction: column;
  align-items: center;
  margin-left: 12px;
  justify-content: space-between;
`;

const TotalCalories = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TotalText = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Bold';
  color: #000000;
`;

const CalorieText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: #d94c4c;
`;

const NutritionRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const Dot = styled.View<{color: string}>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background-color: ${(props: {color: string}) => props.color};
  margin-right: 6px;
`;

const NutritionText = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-SemiBold';
  color: #000000;
  flex: 1;
`;

const ValueText = styled.Text<{color: string}>`
  font-size: 12px;
  font-family: 'Pretendard-Bold';
  color: ${(props: {color: string}) => props.color};
`;

const ProgressBar = styled.View`
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  flex-direction: row;
  margin-top: 6px;
`;

const Progress = styled.View<{color: string; width: number}>`
  height: 100%;
  background-color: ${(props: {color: string}) => props.color};
  width: ${(props: {width: number}) => props.width}%;
`;


