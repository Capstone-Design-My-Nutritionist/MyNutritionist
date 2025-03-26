import React, {useState, useEffect} from 'react';
import {Modal, View} from 'react-native';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hour: string, minute: string) => void;
  title: string;
  initialHour: string;
  initialMinute: string;
}

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

  useEffect(() => {
    setSelectedHour(initialHour);
    setSelectedMinute(initialMinute);
  }, [initialHour, initialMinute]);

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
            <SelectBox>
              <Picker
                selectedValue={selectedHour}
                onValueChange={(itemValue: string) =>
                  setSelectedHour(itemValue)
                }
                mode="dropdown"
                style={{
                  width: '200%',
                  height: 20,
                  fontSize: 12,
                }}
                itemStyle={{fontSize: 13}}>
                {[...Array(24).keys()].map(hour => {
                  const value = hour.toString().padStart(2, '0');
                  return (
                    <Picker.Item key={value} label={value} value={value} />
                  );
                })}
              </Picker>
            </SelectBox>
            <Label>시</Label>
            <SelectBox>
              <Picker
                selectedValue={selectedMinute}
                onValueChange={(itemValue: string) =>
                  setSelectedMinute(itemValue)
                }
                mode="dropdown"
                style={{
                  width: '200%',
                  height: 30,
                  fontSize: 12,
                }}
                itemStyle={{fontSize: 13}}>
                {[...Array(60).keys()].map(min => {
                  const value = min.toString().padStart(2, '0');
                  return (
                    <Picker.Item key={value} label={value} value={value} />
                  );
                })}
              </Picker>
            </SelectBox>
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
  height: 160px;
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

const SelectBox = styled.View`
  border: 1px solid #cccccc;
  border-radius: 8px;
  width: 67px;
  height: 30px;
  justify-content: center;
  overflow: hidden;
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
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 12px;
`;
