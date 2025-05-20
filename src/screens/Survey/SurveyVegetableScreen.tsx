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
  SurveyMealScreen: {from?: string};
  SurveyVegetableScreen: {from?: string};
  SurveyWaterScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyVegetableScreen'
>;

const vegetableOptions = ['거의 먹지 않음', '가끔 먹음', '매일 먹음'];

const mapVegetableOptionToEnum = (label: string): string => {
  switch (label) {
    case '거의 먹지 않음':
      return 'RARELY';
    case '가끔 먹음':
      return 'SOMETIMES';
    case '매일 먹음':
      return 'DAILY';
    default:
      return '';
  }
};

const SurveyVegetableScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (selectedOption) {
      const enumValue = mapVegetableOptionToEnum(selectedOption);
      try {
        await submitSurveyAnswer('vegetable-fruit-intake', {
          vegetableFruitIntake: enumValue,
        });
        console.log('✅ vegetableFruitIntake 저장 완료:', enumValue);
        navigation.navigate('SurveyWaterScreen', from ? {from} : undefined);
      } catch (error) {
        console.error('❌ vegetableFruitIntake 저장 실패:', error);
      }
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={18 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="채소와 과일 섭취 빈도수는 어떻게 되시나요?" />
      <ButtonWrapper>
        <ButtonGrid>
          {vegetableOptions.map(option => (
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

export default SurveyVegetableScreen;
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 73px;
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
