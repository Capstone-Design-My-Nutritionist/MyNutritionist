import React from 'react';
import styled from 'styled-components/native';

interface StackedNutrientBarProps {
  carbohydrate: number;
  fat: number;
  protein: number;
}

const StackedNutrientBar: React.FC<StackedNutrientBarProps> = ({
  carbohydrate,
  fat,
  protein,
}) => {
  const total = carbohydrate + fat + protein;

  const carbPercent = (carbohydrate / total) * 100;
  const fatPercent = (fat / total) * 100;
  const proteinPercent = (protein / total) * 100;

  return (
    <Wrapper>
      <LegendRow>
        <LegendItem>
          <ColorDot color="#FD384C" />
          <LegendText>탄수화물 {carbohydrate}g</LegendText>
        </LegendItem>
        <LegendItem>
          <ColorDot color="#FD9E38" />
          <LegendText>지방 {fat}g</LegendText>
        </LegendItem>
        <LegendItem>
          <ColorDot color="#D95B72" />
          <LegendText>단백질 {protein}g</LegendText>
        </LegendItem>
      </LegendRow>

      <BarContainer>
        <BarFill width={carbPercent} color="#FD384C" />
        <BarFill width={fatPercent} color="#FD9E38" />
        <BarFill width={proteinPercent} color="#D95B72" />
      </BarContainer>
    </Wrapper>
  );
};

export default StackedNutrientBar;

const Wrapper = styled.View`
  margin-top: 12px;
`;

const LegendRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 4px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ColorDot = styled.View<{color: string}>`
  ${({color}: {color: string}) => `
    width: 6px;
    height: 6px;
    border-radius: 3px;
    margin-right: 4px;
    background-color: ${color};
  `}
`;

const LegendText = styled.Text`
  font-size: 11px;
  color: #333;
`;

const BarContainer = styled.View`
  height: 8px;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  flex-direction: row;
  overflow: hidden;
`;

const BarFill = styled.View<{width: number; color: string}>`
  ${({width, color}: {width: number; color: string}) => `
    height: 100%;
    width: ${width}%;
    background-color: ${color};
  `}
`;
