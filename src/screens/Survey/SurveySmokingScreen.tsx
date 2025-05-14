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
  SurveyDrinkScreen: undefined;
  SurveySmokingScreen: undefined;
  SurveyAllergyOkScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveySmokingScreen'
>;

const smokingOptions = ['비흡연', '과거 흡연', '현재 흡연'];

const mapSmokingToEnum = (label: string): string => {
  switch (label) {
    case '비흡연':
      return 'NON_SMOKER';
    case '과거 흡연':
      return 'PAST_SMOKER';
    case '현재 흡연':
      return 'CURRENT_SMOKER';
    default:
      return '';
  }
};

const SurveySmokingScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const enumValue = mapSmokingToEnum(selectedOption);

    try {
      await submitSurveyAnswer('smoking', {smoking: enumValue});
      console.log('✅ smoking 저장 완료:', enumValue);
      navigation.navigate('SurveyAllergyOkScreen');
    } catch (error) {
      console.error('❌ smoking 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={21 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="흡연을 하시나요?" />
      <ButtonWrapper>
        <ButtonGrid>
          {smokingOptions.map(option => (
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

export default SurveySmokingScreen;

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
