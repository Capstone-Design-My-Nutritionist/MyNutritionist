// components/Common/SurveyMultiButtonGroup.tsx
import React from 'react';
import styled from 'styled-components/native';
import SecondaryButton from '../NormalButton/SecondaryButton';
import PrimaryButton from '../NormalButton/PrimaryButton';

interface SurveyMultiButtonGroupProps {
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}

const SurveyMultiButtonGroup: React.FC<SurveyMultiButtonGroupProps> = ({
  onPrevious,
  onNext,
  nextDisabled = false,
}) => {
  return (
    <NavigationButtons>
      <PrimaryButton title="다음" />
      <SecondaryButton title="이전" />
    </NavigationButtons>
  );
};

export default SurveyMultiButtonGroup;

const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 30px;
`;
