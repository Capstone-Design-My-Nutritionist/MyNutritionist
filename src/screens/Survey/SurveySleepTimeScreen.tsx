import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SmallMonoSelectButton from '../../components/SelectButton/SmallMonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

type RootStackParamList = {
  SurveySleepTimeScreen: undefined;
  NextSurveyScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveySleepTimeScreen'
>;

const sleepOptions = ['5시간 이하', '6~7 시간', '8시간 이상'];

const SurveySleepTimeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Selected sleep time:', selectedOption);
      navigation.navigate('NextSurveyScreen');
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={15 / 24} />
      </ProgressBarContainer>

      {/* 질문 */}
      <SurveyTitle text="하루 평균 수면 시간은 몇 시간인가요?" />

      {/* 선택 버튼 */}
      <ButtonWrapper>
        <ButtonGrid>
          {sleepOptions.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonGrid>
      </ButtonWrapper>

      {/* 하단 공통 버튼 */}
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveySleepTimeScreen;

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

const ButtonGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
