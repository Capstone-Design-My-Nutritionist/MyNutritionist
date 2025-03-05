import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

interface Props {
  progress: number; // 0~1 사이 값
}

const ProgressBar: React.FC<Props> = ({progress}) => {
  return (
    <BarContainer>
      <ProgressFill style={{width: `${progress * 100}%`}} />
    </BarContainer>
  );
};

export default ProgressBar;

// ✅ 스타일 정의
const BarContainer = styled(View)`
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  margin-top: 10px;
`;

const ProgressFill = styled(View)`
  height: 100%;
  background-color: #f24859;
`;
