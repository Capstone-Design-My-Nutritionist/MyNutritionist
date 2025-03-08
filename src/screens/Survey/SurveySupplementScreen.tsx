import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

type RootStackParamList = {
  SurveySupplementScreen: undefined;
  NextSurveyScreen: undefined; // 다음 설문조사 페이지
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveySupplementScreen'
>;

const SurveySupplementScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Navigating to NextSurveyScreen...');
      navigation.navigate('NextSurveyScreen');
    }
  };

  return (
    <Container>
      {/* 공통 헤더 사용 */}
      <SurveyHeader
        title="복용약 & 건강기능식품 정보"
        skipTarget="NextSurveyScreen"
      />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={0.3} />
      </ProgressBarContainer>

      {/* 공통 질문 텍스트 사용 */}
      <SurveyTitle text="현재 복용 중인 약이 있으신가요?" />

      {/* 성별 선택 버튼 */}
      <ButtonWrapper>
        <ButtonContainer>
          <MonoSelectButton
            title="예"
            isSelected={selectedOption === '예'}
            onPress={() => setSelectedOption('예')}
          />
          <MonoSelectButton
            title="아니오"
            isSelected={selectedOption === '아니오'}
            onPress={() => setSelectedOption('아니오')}
          />
        </ButtonContainer>
      </ButtonWrapper>

      {/* ✅ 공통 버튼 그룹 사용 */}
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveySupplementScreen;

// ✅ 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
`;

const ButtonWrapper = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 38px;
`;
