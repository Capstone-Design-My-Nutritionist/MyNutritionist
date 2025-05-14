import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SmallMonoSelectButton from '../../components/SelectButton/SmallMonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyHealthGoalsScreen: undefined;
  SurveySleepTimeScreen: undefined;
  SurveyExerciseScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveySleepTimeScreen'
>;

const sleepOptions = ['5시간 이하', '6~7 시간', '8시간 이상'];

const mapSleepTimeToEnum = (label: string): string => {
  switch (label) {
    case '5시간 이하':
      return 'UNDER_5_HOURS';
    case '6~7 시간':
      return 'SIX_TO_SEVEN_HOURS';
    case '8시간 이상':
      return 'OVER_8_HOURS';
    default:
      return '';
  }
};

const SurveySleepTimeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const sleepTimeEnum = mapSleepTimeToEnum(selectedOption);
    try {
      await submitSurveyAnswer('sleepTime', {sleepTime: sleepTimeEnum});
      navigation.navigate('SurveyExerciseScreen');
    } catch (error) {
      console.error('❌ 수면 시간 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={15 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="하루 평균 수면 시간은 몇 시간인가요?" />

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
  margin-bottom: 72px;
`;

const ButtonWrapper = styled.View`
  flex: 0.7;
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
