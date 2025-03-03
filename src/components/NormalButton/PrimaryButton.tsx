import React from 'react';
import styled from 'styled-components/native';

interface PrimaryButtonProps {
  title: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({title}) => {
  return (
    <StyledPrimaryButton>
      <ButtonText>{title}</ButtonText>
    </StyledPrimaryButton>
  );
};

const StyledPrimaryButton = styled.TouchableOpacity`
  width: 150px;
  height: 40px;
  border-radius: 12px;
  background-color: #f24859;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: #ffffff;
`;

export default PrimaryButton;
