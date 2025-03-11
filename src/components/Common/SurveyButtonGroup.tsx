// components/Common/SurveyButtonGroup.tsx
import React from 'react';
import styled from 'styled-components/native';
import OutlineButton from '../NormalButton/SecondaryButton';
import PrimaryButton from '../NormalButton/PrimaryButton';

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
      <OutlineButton title="이전" />
      <PrimaryButton title="다음" />
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
