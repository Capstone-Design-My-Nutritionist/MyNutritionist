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
  SurveyFamilyHistoryOkScreen: undefined;
  NextSurveyScreen: undefined; // 다음 설문 화면으로 연결될 곳
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyFamilyHistoryOkScreen'
>;

const SurveyFamilyHistoryOkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Navigating to NextSurveyScreen...');
      navigation.navigate('NextSurveyScreen'); // 다음 화면으로 이동
    }
  };

  return (
    <Container>
      {/* 공통 헤더 사용 */}
      <SurveyHeader title="질병 & 건강정보" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={11 / 24} />
      </ProgressBarContainer>

      {/* 공통 질문 텍스트 사용 */}
      <SurveyTitle text="가족력(유전적 질병 위험)이 있나요?" />

      {/* 선택 버튼 */}
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

      {/* 공통 버튼 그룹 사용 */}
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveyFamilyHistoryOkScreen;

// 스타일 정의
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
