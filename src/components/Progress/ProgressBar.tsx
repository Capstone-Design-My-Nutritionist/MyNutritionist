import React from 'react';
import styled from 'styled-components/native';

interface ProgressBarProps {
  id: number;
  label: string; // 탄수화물, 단백질 등 카테고리
  consumed: number; // 현재 섭취량
  goal: number; // 목표량
  progressColor?: string; // 프로그레스 바 색상
  unit?: string; // 단위
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  consumed,
  goal,
  progressColor = '#FD384C', // 기본 색상 (빨간색)
  unit,
}) => {
  const progressPercentage = Math.min((consumed / goal) * 100, 100); // 100% 초과 방지

  return (
    <Container>
      <LabelText>{label}</LabelText>
      <BarContainer>
        <Progress width={progressPercentage} color={progressColor} />
      </BarContainer>
      <CarbAmountContainer>
        <CarbAmountText color={progressColor}>{consumed}g</CarbAmountText>
        <CarbAmountText color="#111111">
          / {goal}
          {unit}
        </CarbAmountText>
      </CarbAmountContainer>
    </Container>
  );
};

export default ProgressBar;

const Container = styled.View`
  width: 100px;
  height: 40px;
  align-items: left;
  justify-content: space-between;
`;

const LabelText = styled.Text`
  font-size: 12px;
  font-family: 'Pretendard-Bold';
  color: #111111;
`;

const BarContainer = styled.View`
  width: 100px;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

const Progress = styled.View<{width: number; color: string}>`
  height: 100%;
  width: ${(props: {width: number}) => props.width}%;
  background-color: ${(props: {color: string}) => props.color};
`;

const CarbAmountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const CarbAmountText = styled.Text<{color: string}>`
  font-size: 10px;
  font-family: 'Pretendard-SemiBold';
  color: ${(props: {color: string}) => props.color};
`;
