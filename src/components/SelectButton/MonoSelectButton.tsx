import React, { useState } from "react";
import styled from "styled-components/native";
import { Shadow } from "react-native-shadow-2"

interface MonoSelectButtonProps {
  title: string;
  isSelected?: boolean; 
  onPress?: () => void;
}

const MonoSelectButton: React.FC<MonoSelectButtonProps> = ({
  title,
  isSelected = false,
  onPress,
}) => {
  return (
    <Shadow
          distance={8} 
          startColor="rgba(0, 0, 0, 0.10)" 
          offset={[2, 2]} 
          style={{ borderRadius: 24 }}
        >
      <StyledMonoButton isSelected={isSelected} onPress={onPress}>
        <ButtonText isSelected={isSelected}>{title}</ButtonText>
      </StyledMonoButton>
    </Shadow>
  );
};

const StyledMonoButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: { isSelected: boolean }) => (props.isSelected ? "#F24859" : "#FFFFFF")};
  box-shadow: 2px 2px 10px rgba(0,0,0,0.25);
`;

const ButtonText = styled.Text<{ isSelected: boolean }>`
  font-family: "Pretendard-SemiBold";
  font-size: 28px;
  color: ${(props: {isSelected: boolean }) => (props.isSelected ? "#FFFFFF" : "#111111")};
`;

export default MonoSelectButton;