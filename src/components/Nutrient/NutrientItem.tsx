import React from 'react';
import styled from 'styled-components/native';

interface NutrientItemProps {
  name: string;
  value: string;
}

const NutrientItem: React.FC<NutrientItemProps> = ({ name, value }) => {
  return (
    <Container>
      <NutrientName>{name}</NutrientName>
      <NutrientValue>{value}</NutrientValue>
      <Divider />
    </Container>
  );
};

export default NutrientItem;

const Container = styled.View`
  width: 350px;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NutrientName = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #111111;
`;

const NutrientValue = styled.Text`
  font-family: 'Pretendard-SemiBold';
  font-size: 14px;
  color: #111111;
`;

const Divider = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #8E8E8E;
  opacity: 0.5;
`;
