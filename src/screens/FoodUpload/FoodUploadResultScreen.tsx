import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ProgressBar from '../../components/Progress/ProgressBar';
import CommonHeader from '../../components/Common/CommonHeader';
import MultiNutrientProgressBar from '../../components/Progress/MultiProgressBar';

const FoodUploadResultScreen = () => {
  const [mealType, setMealType] = useState('아침');
  const [selectedFood, setSelectedFood] = useState('삼겹살');

  return (
    <>
      <CommonHeader title="음식 사진 업로드" />

      <FoodImage
        source={{
          uri: 'https://health.chosun.com/site/data/img_dir/2023/11/03/2023110302298_0.jpg',
        }}
      />

      <Container>
        <Scroll>
          <Section>
            <TitleRow>
              <FoodTitle>{selectedFood} & 김치볶음</FoodTitle>

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
                <AltFoodText>목살</AltFoodText>
              </AltFoodButton>
              <AltFoodButton>
                <AltFoodText>항정살</AltFoodText>
              </AltFoodButton>
              <AltFoodButton>
                <AltFoodText>오겹살</AltFoodText>
              </AltFoodButton>
              <AltFoodButton>
                <AltFoodText>음식 직접 검색하기 🔍</AltFoodText>
              </AltFoodButton>
            </AltFoodRow>

            <SummaryRow>
              <SummaryLabel>총 섭취량</SummaryLabel>
              <KcalText>938kcal</KcalText>
            </SummaryRow>

            <MultiNutrientProgressBar
              carbohydrate={10.4}
              fat={83.4}
              protein={45.1}
            />
          </Section>

          <Divider />

          <InfoBlock>
            <InfoRow>
              <InfoLabel>삼겹살</InfoLabel>
              <GramInput placeholder="g을 입력해주세요..." />
            </InfoRow>
          </InfoBlock>

          <InfoBlock>
            <InfoRow>
              <InfoLabel>콜레스테롤</InfoLabel>
              <InfoValue>79.4 mg</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>나트륨</InfoLabel>
              <InfoValue>1152.8 mg</InfoValue>
            </InfoRow>
          </InfoBlock>

          <Divider />

          <InfoBlock>
            <InfoRow>
              <InfoLabel>상추</InfoLabel>
              <GramInput placeholder="g을 입력해주세요..." />
            </InfoRow>
          </InfoBlock>

          <InfoBlock>
            <InfoRow>
              <InfoLabel>식이섬유</InfoLabel>
              <InfoValue>0.5 g</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>칼슘</InfoLabel>
              <InfoValue>15 mg</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>비타민A</InfoLabel>
              <InfoValue>0.6 mg</InfoValue>
            </InfoRow>
          </InfoBlock>

          <Divider />

          <MealTypeRow>
            <MealTypeLabel>추가 음식</MealTypeLabel>
            <SearchInput placeholder="추가 음식 검색하기" />
          </MealTypeRow>
        </Scroll>

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

const Scroll = styled.ScrollView`
  padding: 20px;
`;

const Section = styled.View`
  margin-bottom: 15px;
`;

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
  background-color: #ddd;
  margin: 16px 0;
`;

const InfoBlock = styled.View`
  margin-bottom: 16px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Regular';
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
`;

const GramInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  margin-top: 4px;
  flex: 1;
`;

const MealTypeRow = styled.View`
  margin-bottom: 20px;
`;

const MealTypeLabel = styled.Text`
  font-size: 14px;
  margin-bottom: 6px;
`;

const SearchInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
`;

const BottomButtons = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
  border-top-width: 1px;
  border-color: #eee;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #d95b72;
  padding: 10px 40px;
  border-radius: 8px;
`;

const SubmitText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const CancelButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  padding: 10px 40px;
  border-radius: 8px;
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 14px;
`;
