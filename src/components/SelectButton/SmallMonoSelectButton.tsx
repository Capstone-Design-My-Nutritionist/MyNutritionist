import React from 'react';
import styled from 'styled-components/native';
import {Shadow} from 'react-native-shadow-2';

interface SmallMonoSelectButtonProps {
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const SmallMonoSelectButton: React.FC<SmallMonoSelectButtonProps> = ({
  title,
  isSelected = false,
  onPress,
}) => {
  return (
    <Shadow
      distance={5}
      startColor="rgba(0, 0, 0, 0.10)"
      offset={[2, 2]}
      style={{borderRadius: 24}}>
      <StyledButton isSelected={isSelected} onPress={onPress}>
        <ButtonText isSelected={isSelected}>{title}</ButtonText>
      </StyledButton>
    </Shadow>
  );
};

export default SmallMonoSelectButton;

// ✅ 스타일 정의
const StyledButton = styled.TouchableOpacity<{isSelected: boolean}>`
  width: 90px;
  height: 80px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? '#F24859' : '#FFFFFF'};
`;

const ButtonText = styled.Text`
  font-family: 'Pretendard-SemiBold';
  font-size: 14px;
  color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? '#FFFFFF' : '#111111'};
`;
