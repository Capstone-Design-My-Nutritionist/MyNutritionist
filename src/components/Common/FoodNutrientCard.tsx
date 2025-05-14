import React from 'react';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';
import {Shadow} from 'react-native-shadow-2';
import {View} from 'react-native';
import {Dimensions} from 'react-native';

interface Nutrient {
  label: string;
  value: string;
}

interface Props {
  foodName: string;
  servingInfo: string;
  nutrients?: Nutrient[];
  unit: string;
  inputValue: string;
  onUnitChange: (value: string) => void;
  onInputChange: (value: string) => void;
  onInput: () => void;
  showRemoveButton?: boolean;
}

const screenWidth = Dimensions.get('window').width;

const FoodNutrientCard: React.FC<Props> = ({
  foodName,
  servingInfo,
  nutrients = [],
  unit,
  inputValue,
  onUnitChange,
  onInputChange,
  onInput,
  showRemoveButton = true,
}) => {
  return (
    <Container>
      {/* 음식 이름 + 단위 선택 */}
      <TopRow>
        <FoodName>{foodName}</FoodName>
        <UnitPickerWrapper>
          <Picker
            selectedValue={unit}
            onValueChange={onUnitChange}
            mode="dropdown"
            style={{width: 73, height: 22}}>
            <Picker.Item label="g" value="g" />
            <Picker.Item label="개" value="개" />
          </Picker>
        </UnitPickerWrapper>
      </TopRow>
      {/* 1인분 정보 + 입력 필드 */}
      <MiddleRow>
        <InfoColumn>
          {servingInfo.split('\n').map((text, idx) => (
            <ServingInfo key={idx} isSub={idx !== 0}>
              {text}
            </ServingInfo>
          ))}
        </InfoColumn>
        <InputGroup>
          <GramInput
            placeholder={`${unit}을 입력해주세요.`}
            value={inputValue}
            onChangeText={onInputChange}
          />
          <Shadow
            distance={4}
            offset={[1, 4]}
            startColor="rgba(0, 0, 0, 0.05)"
            containerStyle={{borderRadius: 6}}>
            <InputButton onPress={onInput}>
              <InputButtonText>입력</InputButtonText>
            </InputButton>
          </Shadow>
        </InputGroup>
      </MiddleRow>
      <Divider width={screenWidth} />

      {nutrients.map((nutrient, idx) => (
        <View key={idx}>
          <NutrientRow>
            <NutrientLabel>{nutrient.label}</NutrientLabel>
            <NutrientValue>{nutrient.value}</NutrientValue>
          </NutrientRow>

          {/* 마지막 아이템이면 Divider 생략 */}
          {idx !== nutrients.length - 1 && <InnerDivider />}
        </View>
      ))}
    </Container>
  );
};

export default FoodNutrientCard;

const Container = styled.View`
  padding-vertical: 12px;
  padding-horizontal: 20px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FoodName = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: black;
`;

const UnitPickerWrapper = styled.View`
  border: 1px solid #ccc;
  width: 72px;
  height: 22px;
  border-radius: 8px;
  overflow: hidden;
`;

const MiddleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 8px;
`;

const InfoColumn = styled.View``;

const ServingInfo = styled.Text<{isSub: boolean}>`
  font-size: ${(props: {isSub: boolean}) => (props.isSub ? '12px' : '13px')};
  color: ${(props: {isSub: boolean}) => (props.isSub ? '#999' : '#000')};
  font-family: ${(props: {isSub: boolean}) =>
    props.isSub ? 'Pretendard-Regular' : 'Pretendard-SemiBold'};
`;

const InputGroup = styled.View`
  width: 170px;
  height: 24px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const GramInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  width: 120px;
`;

const InputButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 45px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const InputButtonText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: 'Pretendard-Bold';
`;

const Divider = styled.View<{width: number}>`
  width: ${(props: {width: number}) => props.width}px;
  height: 1px;
  background-color: rgba(115, 26, 34, 0.5);
  align-self: center;
  margin-vertical: 16px;
`;

const InnerDivider = styled.View`
  height: 1px;
  background-color: rgba(142, 142, 142, 0.5);
  margin-vertical: 16px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const NutrientLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: black;
`;

const NutrientValue = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: black;
`;
