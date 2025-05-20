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
  SurveyVegetableScreen: {from?: string};
  SurveyWaterScreen: {from?: string};
  SurveyDrinkScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyWaterScreen'
>;

const waterOptions = ['1L 이하', '1~2L', '2L 이상'];

const mapWaterOptionToEnum = (label: string): string => {
  switch (label) {
    case '1L 이하':
      return 'UNDER_1L';
    case '1~2L':
      return 'ONE_TO_TWO_L';
    case '2L 이상':
      return 'OVER_2L';
    default:
      return '';
  }
};

const SurveyWaterScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (selectedOption) {
      const enumValue = mapWaterOptionToEnum(selectedOption);
      try {
        await submitSurveyAnswer('water-intake', {
          waterIntake: enumValue,
        });
        console.log('✅ waterIntake 저장 완료:', enumValue);
        navigation.navigate('SurveyDrinkScreen', from ? {from} : undefined);
      } catch (error) {
        console.error('❌ waterIntake 저장 실패:', error);
      }
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={19 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="하루 물 섭취량이 어느 정도 되시나요?" />
      <ButtonWrapper>
        <ButtonGrid>
          {waterOptions.map(option => (
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

export default SurveyWaterScreen;
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
