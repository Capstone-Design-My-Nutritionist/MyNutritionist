import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';
import CommonHeader from '../../components/Common/CommonHeader';
import MultiNutrientProgressBar from '../../components/Progress/MultiProgressBar';
import FoodNutrientCard from '../../components/Common/FoodNutrientCard';
import {dummyMealRecord} from '../../data/dummyMealRecordData';

const FoodUploadResultScreen = () => {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [mealType, setMealType] = useState('아침');
  const [mealData] = useState(dummyMealRecord);

  return (
    <>
      <CommonHeader title="음식 사진 업로드" />

      <FoodImage source={{uri: mealData.mainFood.imageUrl}} />

      <Container>
        <TitleContainer>
          <TitleRow>
            <FoodTitle>{mealData.mainFood.name}</FoodTitle>

            <PickerWrapper>
              <Picker
                selectedValue={mealType}
                onValueChange={(value: string) => setMealType(value)}
                mode="dropdown"
                style={{width: 50, height: 24}}>
                <Picker.Item label="아침" value="아침" />
                <Picker.Item label="점심" value="점심" />
                <Picker.Item label="저녁" value="저녁" />
              </Picker>
            </PickerWrapper>
          </TitleRow>

          <AltFoodRow>
            <AltFoodButton>
              <AltFoodText>육개장</AltFoodText>
            </AltFoodButton>
            <AltFoodButton>
              <AltFoodText>김치찌개</AltFoodText>
            </AltFoodButton>
            <AltFoodButton>
              <AltFoodText>순대국밥</AltFoodText>
            </AltFoodButton>
            <AltFoodButton>
              <AltFoodText>음식 직접 검색하기 🔍</AltFoodText>
            </AltFoodButton>
          </AltFoodRow>

          <SummaryRow>
            <SummaryLabel>총 섭취량</SummaryLabel>
            <KcalText>{mealData.mainFood.kcal}kcal</KcalText>
          </SummaryRow>

          <MultiNutrientProgressBar
            carbohydrate={mealData.mainFood.carbs}
            fat={mealData.mainFood.fat}
            protein={mealData.mainFood.protein}
          />
        </TitleContainer>

        <Divider />

        <Scroll>
          <FoodNutrientCard
            foodName={mealData.mainFood.name}
            servingInfo={
              mealData.mainFood.serving + '\n' + `${mealData.mainFood.kcal}kcal`
            }
            nutrients={Object.entries(mealData.mainFood.nutrients).map(
              ([label, value]) => ({
                label,
                value,
              }),
            )}
            unit="g"
            inputValue={amount}
            onUnitChange={setUnit}
            onInputChange={setAmount}
            onInput={() => console.log('입력')}
          />
          <BoldDivider />
          <FoodNutrientCard
            foodName={mealData.mainFood.name}
            servingInfo={
              mealData.mainFood.serving + '\n' + `${mealData.mainFood.kcal}kcal`
            }
            nutrients={Object.entries(mealData.mainFood.nutrients).map(
              ([label, value]) => ({
                label,
                value,
              }),
            )}
            unit="g"
            inputValue={amount}
            onUnitChange={setUnit}
            onInputChange={setAmount}
            onInput={() => console.log('입력')}
          />
          <BoldDivider />

          <MealTypeRow>
            <MealTypeLabel>추가 음식</MealTypeLabel>
            <SearchInput placeholder="추가 음식 검색하기" />
          </MealTypeRow>
        </Scroll>

        <Divider />
        <BottomButtons>
          <SubmitButton>
            <SubmitText>제출</SubmitText>
          </SubmitButton>
          <CancelButton>
            <CancelText>취소</CancelText>
          </CancelButton>
        </BottomButtons>
      </Container>
    </>
  );
};

export default FoodUploadResultScreen;

const FoodImage = styled.Image`
  margin-top: -6px;
  width: 100%;
  height: 200px;
`;

const Container = styled.View`
  flex: 1;
  margin-top: -20px;
  border-radius: 12px;
  background-color: #fff;
`;

const TitleContainer = styled.View`
  padding: 20px;
`;

const Scroll = styled.ScrollView``;

const TitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FoodTitle = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #000;
`;

const PickerWrapper = styled.View`
  width: 50px;
  height: 24px;
  border: 1px solid #d95b72;
  border-radius: 6px;
  overflow: hidden;
`;

const AltFoodRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 20px;
`;

const AltFoodButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  border-radius: 6px;
  padding: 4px 12px;
`;

const AltFoodText = styled.Text`
  font-size: 10px;
  color: #d95b72;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const SummaryLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: black;
`;

const KcalText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: black;
`;

const Divider = styled.View`
  height: 1px;
  background-color: rgba(115, 26, 34, 0.5);
  margin-horizontal: -20px;
`;

const BoldDivider = styled.View`
  height: 6px;
  background-color: rgba(115, 26, 34, 0.5);
  margin-top: px;
  margin-horizontal: -20px;
`;

const MealTypeRow = styled.View`
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MealTypeLabel = styled.Text`
  color: black;
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  margin-right: 12px;
`;

const SearchInput = styled.TextInput`
  width: 115px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
`;

const BottomButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  height: 95px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 150px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const SubmitText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const CancelButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  width: 150px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 14px;
`;
