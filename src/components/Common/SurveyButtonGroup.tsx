// components/Common/SurveyButtonGroup.tsx
import React from 'react';
import styled from 'styled-components/native';
import OutlineButton from '../Button/OutlineButton';
import PrimaryButton from '../Button/PrimaryButton';

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
  return (
    <NavigationButtons>
      <OutlineButton label="이전" onPress={onPrevious} />
      <PrimaryButton label="다음" onPress={onNext} disabled={nextDisabled} />
    </NavigationButtons>
  );
};

export default SurveyButtonGroup;

// ✅ 스타일 정의
const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 30px;
`;
