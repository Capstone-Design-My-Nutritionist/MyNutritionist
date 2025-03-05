import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styled from 'styled-components/native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const OutlineButton: React.FC<Props> = ({label, onPress, disabled}) => {
  return (
    <Button onPress={onPress} disabled={disabled}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
};

export default OutlineButton;

// ✅ 스타일 정의 (PrimaryButton과 다르게 독립적으로 설정)
const Button = styled(TouchableOpacity)`
  width: 150px;
  height: 40px;
  background-color: white;
  border: 2px solid #f24859;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(Text)`
  font-size: 14px;
  color: #f24859;
  font-weight: bold;
`;
