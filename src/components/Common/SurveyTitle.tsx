// components/Common/SurveyTitle.tsx
import React from 'react';
import styled from 'styled-components/native';

interface SurveyTitleProps {
  text: string;
}

const SurveyTitle: React.FC<SurveyTitleProps> = ({text}) => {
  return (
    <TitleContainer>
      <Title>{text}</Title>
    </TitleContainer>
  );
};

export default SurveyTitle;

// ✅ 스타일 정의
const TitleContainer = styled.View`
  flex: 0.15;
  justify-content: flex-end;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #8c0303;
  text-align: center;
`;
