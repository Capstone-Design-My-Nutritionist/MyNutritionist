import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SmallMonoSelectButton from '../../components/SelectButton/SmallMonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveySleepTimeScreen: {from?: string};
  SurveyExerciseScreen: {from?: string};
  SurveyMealScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyExerciseScreen'
>;

const exerciseOptionsTop = [
  '거의 하지 않음',
  '1~3회\n\n가벼운 운동',
  '3~5회\n\n보통강도',
];
const exerciseOptionsBottom = [
  '6~7회\n\n강도높은 운동',
  '매일\n\n활동적이거나\n운동선수',
];

const mapExerciseToEnum = (label: string): string => {
  switch (label) {
    case '거의 하지 않음':
      return 'NONE';
    case '1~3회\n\n가벼운 운동':
      return 'LIGHT_1_3';
    case '3~5회\n\n보통강도':
      return 'MODERATE_3_5';
    case '6~7회\n\n강도높은 운동':
      return 'INTENSE_6_7';
    case '매일\n\n활동적이거나\n운동선수':
      return 'DAILY_ACTIVE';
    default:
      return '';
  }
};

const SurveyExerciseScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const exerciseEnum = mapExerciseToEnum(selectedOption);
    try {
      await submitSurveyAnswer('exerciseFrequency', {
        exerciseFrequency: exerciseEnum,
      });
      navigation.navigate('SurveyMealScreen', from ? {from} : undefined);
    } catch (error) {
      console.error('❌ 운동 빈도 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={16 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="주당 운동 빈도는 어떻게 되시나요?" />

      <ButtonWrapper>
        <ButtonRow>
          {exerciseOptionsTop.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonRow>
        <ButtonRow>
          {exerciseOptionsBottom.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonRow>
      </ButtonWrapper>

      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveyExerciseScreen;

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

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
