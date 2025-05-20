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
  SurveyWaterScreen: {from?: string};
  SurveyDrinkScreen: {from?: string};
  SurveySmokingScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyDrinkScreen'
>;

const drinkOptionsTop = ['전혀 안함', '가끔'];
const drinkOptionsBottom = ['주 1~2회', '주 3회 이상'];

const mapDrinkingToEnum = (label: string): string => {
  switch (label) {
    case '전혀 안함':
      return 'NEVER';
    case '가끔':
      return 'SOMETIMES';
    case '주 1~2회':
      return 'ONE_TWO_WEEKLY';
    case '주 3회 이상':
      return 'THREE_MORE_WEEKLY';
    default:
      return '';
  }
};

const SurveyDrinkScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (selectedOption) {
      const enumValue = mapDrinkingToEnum(selectedOption);
      try {
        await submitSurveyAnswer('drinking', {drinking: enumValue});
        console.log('✅ drinking 저장 완료:', enumValue);
        navigation.navigate('SurveySmokingScreen', from ? {from} : undefined);
      } catch (error) {
        console.error('❌ drinking 저장 실패:', error);
      }
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={20 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="음주를 얼마나 하시나요?" />
      <ButtonWrapper>
        <ButtonRow>
          {drinkOptionsTop.map(option => (
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
          {drinkOptionsBottom.map(option => (
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

export default SurveyDrinkScreen;
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
