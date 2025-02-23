import React from "react";
import styled from "styled-components/native";

interface SecondaryButtonProps {
  title: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ title }) => {
  return (
    <StyledSecondaryButton>
      <ButtonText>{title}</ButtonText>
    </StyledSecondaryButton>
  );
};

const StyledSecondaryButton = styled.TouchableOpacity`
  width: 150px;
  height: 40px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: #F24859;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-family: "Pretendard-Bold";
  color: #F24859;
`;

export default SecondaryButton;