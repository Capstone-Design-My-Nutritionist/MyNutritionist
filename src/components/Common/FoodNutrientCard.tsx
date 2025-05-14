import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Modal, TouchableOpacity, Dimensions} from 'react-native';

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
  onRemove?: () => void;
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
  showRemoveButton = false,
  onRemove,
}) => {
  return (
    <Container>
      {/* 음식 이름 + 단위 선택 */}
      <TopRow>
        <FoodName>{foodName}</FoodName>
        <CustomDropdown 
          value={unit}
          options={['g', '개', '인분']}
          onSelect={onUnitChange}
          width={70}
        />
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
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <InputButton onPress={onInput}>
            <InputButtonText>입력</InputButtonText>
          </InputButton>
        </InputGroup>
      </MiddleRow>
      
      {/* 삭제 버튼 - 더 눈에 띄게 상단에 배치 */}
      {showRemoveButton && onRemove && (
        <RemoveButtonContainer>
          <RemoveButton onPress={onRemove}>
            <RemoveButtonText>삭제</RemoveButtonText>
          </RemoveButton>
        </RemoveButtonContainer>
      )}

      <Divider />

      <NutrientContainer>
        {nutrients.map((nutrient, idx) => (
          <React.Fragment key={idx}>
            <NutrientRow>
              <NutrientLabel>{nutrient.label}</NutrientLabel>
              <NutrientValue>{nutrient.value}</NutrientValue>
            </NutrientRow>
            {idx < nutrients.length - 1 && <NutrientDivider />}
          </React.Fragment>
        ))}
      </NutrientContainer>
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

// 커스텀 드롭다운 컴포넌트
interface CustomDropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  width?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onSelect, width = 80 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContainer style={{ width }}>
      <DropdownButton onPress={() => setIsOpen(true)}>
        <DropdownButtonText>{value}</DropdownButtonText>
        <DropdownArrow>▼</DropdownArrow>
      </DropdownButton>

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <ModalOverlay onPress={() => setIsOpen(false)}>
          <ModalContent>
            {options.map((option, index) => (
              <OptionButton
                key={index}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                isSelected={option === value}
              >
                <OptionText isSelected={option === value}>{option}</OptionText>
              </OptionButton>
            ))}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.View`
  position: relative;
`;

const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  padding-horizontal: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
`;

const DropdownButtonText = styled.Text`
  font-size: 12px;
  color: #000;
  font-family: 'Pretendard-Regular';
`;

const DropdownArrow = styled.Text`
  font-size: 8px;
  color: #999;
  margin-left: 4px;
`;

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 120px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const OptionButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 10px 12px;
  background-color: ${(props: { isSelected: boolean }) => props.isSelected ? 'rgba(217, 91, 114, 0.1)' : 'white'};
`;

const OptionText = styled.Text<{ isSelected: boolean }>`
  font-size: 12px;
  color: ${(props: { isSelected: boolean }) => props.isSelected ? '#d95b72' : '#000'};
  font-family: ${(props: { isSelected: boolean }) => props.isSelected ? 'Pretendard-SemiBold' : 'Pretendard-Regular'};
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
  font-family: 'Pretendard-Medium';
`;

const RemoveButtonContainer = styled.View`
  align-items: flex-end;
  margin-top: 8px;
  margin-bottom: 4px;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: #FF6B6B;
  padding: 8px 12px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  elevation: 2;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
`;

const RemoveButtonText = styled.Text`
  color: white;
  font-size: 13px;
  font-family: 'Pretendard-SemiBold';
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

const NutrientContainer = styled.View`
  margin-top: 8px;
`;



const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 8px;
`;

const NutrientDivider = styled.View`
  height: 1px;
  background-color: #EEEEEE;
  width: 100%;
`;

const NutrientLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: black;
  margin-left: 4px;
`;

const NutrientValue = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: black;
  margin-right: 4px;
`;
