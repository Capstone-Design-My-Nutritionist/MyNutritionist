import React from 'react';
import styled from 'styled-components/native';

interface Props {
  text: string;
}

const SurveyTitle: React.FC<Props> = ({text}) => {
  return (
    <TitleText numberOfLines={2} ellipsizeMode="tail">
      {text}
    </TitleText>
  );
};

export default SurveyTitle;

const TitleText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #a83232;
  text-align: center;
  margin-bottom: 4px;
  flex-shrink: 1;
  width: 100%;
  padding-horizontal: 8px;
`;
