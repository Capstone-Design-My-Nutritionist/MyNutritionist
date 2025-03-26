import React, {useState, useEffect} from 'react';
import {Modal, View} from 'react-native';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (year: string, month: string) => void;
  title: string;
  initialYear: string;
  initialMonth: string;
}

const DatePickerModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  initialYear,
  initialMonth,
}: Props) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  useEffect(() => {
    setSelectedYear(initialYear);
    setSelectedMonth(initialMonth);
  }, [initialYear, initialMonth]);

  // 연도 배열 생성 (현재 연도 기준 -5년 ~ +5년)
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 11}, (_, i) => (currentYear - 5 + i).toString());

  // 월 배열 생성 (1~12월)
  const months = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent>
      <Backdrop>
        <ModalContainer>
          <ModalTitle>{title}</ModalTitle>
          <DateRow>
            <SelectBox>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue: string) =>
                  setSelectedYear(itemValue)
                }
                mode="dropdown"
                style={{
                  width: '200%',
                  height: 20,
                  fontSize: 12,
                }}
                itemStyle={{fontSize: 13}}>
                {years.map(year => (
                  <Picker.Item key={year} label={year + '년'} value={year} />
                ))}
              </Picker>
            </SelectBox>
            <SelectBox>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue: string) =>
                  setSelectedMonth(itemValue)
                }
                mode="dropdown"
                style={{
                  width: '200%',
                  height: 30,
                  fontSize: 12,
                }}
                itemStyle={{fontSize: 13}}>
                {months.map(month => (
                  <Picker.Item key={month} label={month + '월'} value={month} />
                ))}
              </Picker>
            </SelectBox>
          </DateRow>
          <ButtonRow>
            <PrimaryButton
              onPress={() => onConfirm(selectedYear, selectedMonth)}>
              <ButtonText>확인</ButtonText>
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

export default DatePickerModal;

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
  color: #E44F68;
`;

const DateRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const SelectBox = styled.View`
  border: 1px solid #cccccc;
  border-radius: 8px;
  width: 100px;
  height: 30px;
  justify-content: center;
  overflow: hidden;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #E44F68;
  width: 80px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SecondaryButton = styled.TouchableOpacity`
  border: 1px solid #E44F68;
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
  color: #E44F68;
  font-size: 12px;
  font-family: 'Pretendard-Medium';
`;
