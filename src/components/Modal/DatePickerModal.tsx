import React, {useState, useEffect} from 'react';
import {Modal, View, Platform} from 'react-native';
import styled from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (year: string, month: string) => void;
  title: string;
  initialYear: string;
  initialMonth: string;
}

// DropDownPicker 아이템 타입 정의
type DropdownItem = {
  label: string;
  value: string;
};

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
  
  // DropDownPicker에 필요한 상태
  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearItems, setYearItems] = useState<DropdownItem[]>([]);
  const [monthItems, setMonthItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    setSelectedYear(initialYear);
    setSelectedMonth(initialMonth);
  }, [initialYear, initialMonth]);

  // 연도 배열 생성 (현재 연도 기준 -5년 ~ +5년)
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 11}, (_, i) =>
    (currentYear - 5 + i).toString(),
  );

  // 월 배열 생성 (1~12월)
  const months = Array.from({length: 12}, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  
  // DropDownPicker에 사용할 아이템 형식으로 변환
  useEffect(() => {
    const yearOptions: DropdownItem[] = years.map(year => ({
      label: year + '년',
      value: year,
    }));
    setYearItems(yearOptions);
    
    const monthOptions: DropdownItem[] = months.map(month => ({
      label: month + '월',
      value: month,
    }));
    setMonthItems(monthOptions);
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
          <DateRow>
            <DropdownContainer>
              <DropDownPicker
                open={yearOpen}
                value={selectedYear}
                items={yearItems}
                setOpen={setYearOpen}
                setValue={setSelectedYear}
                setItems={setYearItems}
                style={dropdownStyle}
                textStyle={dropdownTextStyle}
                dropDownContainerStyle={dropdownContainerStyle}
                zIndex={3000}
                zIndexInverse={1000}
                placeholder=""
              />
            </DropdownContainer>
            <DropdownContainer>
              <DropDownPicker
                open={monthOpen}
                value={selectedMonth}
                items={monthItems}
                setOpen={setMonthOpen}
                setValue={setSelectedMonth}
                setItems={setMonthItems}
                style={dropdownStyle}
                textStyle={dropdownTextStyle}
                dropDownContainerStyle={dropdownContainerStyle}
                zIndex={2000}
                zIndexInverse={2000}
                placeholder=""
              />
            </DropdownContainer>
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

// DropDownPicker 스타일
const dropdownStyle = {
  backgroundColor: '#fff',
  borderColor: '#cccccc',
  height: 30,
  minHeight: 30,
};

const dropdownTextStyle = {
  fontSize: 13,
  fontFamily: 'Pretendard-Medium',
};

const dropdownContainerStyle = {
  borderColor: '#cccccc',
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
  color: #e44f68;
`;

const DateRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const DropdownContainer = styled.View`
  width: 100px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #e44f68;
  width: 80px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SecondaryButton = styled.TouchableOpacity`
  border: 1px solid #e44f68;
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
  color: #e44f68;
  font-size: 12px;
  font-family: 'Pretendard-Medium';
`;
