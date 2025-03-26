import React from 'react';
import styled from 'styled-components/native';

interface HeaderWithUnderlineProps {
  title: string;
}

const HeaderWithUnderline = ({title}: HeaderWithUnderlineProps) => {
  return (
    <TitleWrapper>
      <Title>{title}</Title>
      <TitleUnderline />
    </TitleWrapper>
  );
};

export default HeaderWithUnderline;

const TitleWrapper = styled.View`
  background-color: #ffffff;
  padding-top: 11px;
  padding-bottom: 12px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #731a22;
  text-align: center;
  margin-bottom: 11px;
`;

const TitleUnderline = styled.View`
  width: 100%;
  height: 1.3px;
  background-color: #731a22;
`;
