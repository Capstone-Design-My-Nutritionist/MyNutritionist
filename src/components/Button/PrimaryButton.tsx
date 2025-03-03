import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styled from 'styled-components/native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({label, onPress, disabled}) => {
  return (
    <Button onPress={onPress} disabled={disabled}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
};

export default PrimaryButton;

// ✅ 스타일 정의
const Button = styled(TouchableOpacity)`
  width: 100px;
  height: 40px;
  background-color: #f24859;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(Text)`
  font-size: 14px;
  color: white;
  font-weight: bold;
`;
