import React, {useState, useEffect} from 'react';
import {Modal, View, Platform} from 'react-native';
import styled from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hour: string, minute: string) => void;
  title: string;
  initialHour: string;
  initialMinute: string;
}

// DropDownPicker 아이템 타입 정의
type DropdownItem = {
  label: string;
  value: string;
};

const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  initialHour,
  initialMinute,
}: Props) => {
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  
  // DropDownPicker에 필요한 상태
  const [hourOpen, setHourOpen] = useState(false);
  const [minuteOpen, setMinuteOpen] = useState(false);
  const [hourItems, setHourItems] = useState<DropdownItem[]>([]);
  const [minuteItems, setMinuteItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    setSelectedHour(initialHour);
    setSelectedMinute(initialMinute);
  }, [initialHour, initialMinute]);
  
  // DropDownPicker에 사용할 아이템 형식으로 변환
  useEffect(() => {
    const hourOptions: DropdownItem[] = [...Array(24).keys()].map(hour => {
      const value = hour.toString().padStart(2, '0');
      return {
        label: value,
        value: value,
      };
    });
    setHourItems(hourOptions);
    
    const minuteOptions: DropdownItem[] = [...Array(60).keys()].map(min => {
      const value = min.toString().padStart(2, '0');
      return {
        label: value,
        value: value,
      };
    });
    setMinuteItems(minuteOptions);
  }, []);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent>
      <Backdrop>
        <ModalContainer>
          <ModalTitle>{title}</ModalTitle>
          <TimeRow>
            <DropdownContainer>
              <DropDownPicker
                open={hourOpen}
                value={selectedHour}
                items={hourItems}
                setOpen={setHourOpen}
                setValue={setSelectedHour}
                setItems={setHourItems}
                style={dropdownStyle}
                textStyle={dropdownTextStyle}
                dropDownContainerStyle={dropdownContainerStyle}
                zIndex={3000}
                zIndexInverse={1000}
                placeholder=""
              />
            </DropdownContainer>
            <Label>시</Label>
            <DropdownContainer>
              <DropDownPicker
                open={minuteOpen}
                value={selectedMinute}
                items={minuteItems}
                setOpen={setMinuteOpen}
                setValue={setSelectedMinute}
                setItems={setMinuteItems}
                style={dropdownStyle}
                textStyle={dropdownTextStyle}
                dropDownContainerStyle={dropdownContainerStyle}
                zIndex={2000}
                zIndexInverse={2000}
                placeholder=""
              />
            </DropdownContainer>
            <Label>분</Label>
          </TimeRow>
          <ButtonRow>
            <PrimaryButton
              onPress={() => onConfirm(selectedHour, selectedMinute)}>
              <ButtonText>변경하기</ButtonText>
            </PrimaryButton>
            <SecondaryButton onPress={onClose}>
              <CancelText>취소</CancelText>
            </SecondaryButton>
          </ButtonRow>
        </ModalContainer>
      </Backdrop>
    </Modal>
  );
};

export default TimePickerModal;

// DropDownPicker 스타일
const dropdownStyle = {
  backgroundColor: '#fff',
  borderColor: '#cccccc',
  height: 30,
  minHeight: 30,
  width: 67,
};

const dropdownTextStyle = {
  fontSize: 13,
  fontFamily: 'Pretendard-Medium',
};

const dropdownContainerStyle = {
  borderColor: '#cccccc',
  width: 67,
};

const Backdrop = styled.View`
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
`;

const ModalContainer = styled.View`
  background-color: #fff;
  width: 280px;
  height: 180px;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: #8c0303;
`;

const TimeRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DropdownContainer = styled.View`
  width: 67px;
  margin-horizontal: 4px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #000000;
  margin-horizontal: 4px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 80px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SecondaryButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  width: 80px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-family: 'Pretendard-Medium';
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 12px;
  font-family: 'Pretendard-Medium';
`;
