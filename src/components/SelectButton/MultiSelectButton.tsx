import react from "react";
import styled from "styled-components/native";
import { Shadow } from "react-native-shadow-2"

interface MultiSelectButtonProps {
  title: string;
  isSelected?: boolean; 
  onPress?: () => void;
} 

const MultiSelectButton: React.FC<MultiSelectButtonProps> = ({
  title,
  isSelected = false,
  onPress,
}) => {
  return (
    <Shadow
      distance={5} 
      startColor="rgba(0, 0, 0, 0.10)" 
      offset={[2, 2]} 
      style={{ borderRadius: 24 }}
    >
      <StyledMultiButton isSelected={isSelected} onPress={onPress}>
        <ButtonText isSelected={isSelected}>{title}</ButtonText>
      </StyledMultiButton>
    </Shadow>
  );
};

const StyledMultiButton = styled.TouchableOpacity<{isSelected : boolean }>`
  width: 90px;
  height: 80px;
  background-color: #F24859;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  border: 1px solid #FFFFFF;
  background-color: ${(props: { isSelected: boolean }) => (props.isSelected ? "#F24859" : "#FFFFFF")};

`;

const ButtonText = styled.Text`
  font-family: "Pretendard-SemiBold";
  font-size: 14px;
  color: ${(props: { isSelected: boolean }) => (props.isSelected ? "#FFFFFF" : "#111111")};
`;

export default MultiSelectButton;