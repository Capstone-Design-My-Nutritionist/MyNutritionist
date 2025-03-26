// components/Common/SurveyButtonGroup.tsx
import React from 'react';
import styled from 'styled-components/native';
import PrimaryButton from '../NormalButton/PrimaryButton';
import SecondaryButton from '../NormalButton/SecondaryButton';

interface SurveyButtonGroupProps {
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}

const SurveyButtonGroup: React.FC<SurveyButtonGroupProps> = ({
  onPrevious,
  onNext,
  nextDisabled = false,
}) => {
  const handleNextPress = () => {
    if (!nextDisabled) {
      onNext();
    }
  };

  return (
    <NavigationButtons>
      <SecondaryButton title="이전" onPress={onPrevious} />
      <PrimaryButton title="다음" onPress={handleNextPress} />
    </NavigationButtons>
  );
};

export default SurveyButtonGroup;

// 스타일 정의
const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 30px;
`;
