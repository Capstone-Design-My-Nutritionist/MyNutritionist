import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveySmokingScreen: undefined;
  SurveyAllergyOkScreen: undefined;
  SurveyAllergyScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAllergyOkScreen'
>;

const SurveyAllergyOkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const hasAllergy = selectedOption === '예';

    try {
      await submitSurveyAnswer('allergy-status', {hasAllergy});
      console.log('✅ 알레르기 여부 저장 완료:', hasAllergy);
      navigation.navigate('SurveyAllergyScreen');
    } catch (error) {
      console.error('❌ 알레르기 여부 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="알레르기 정보" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={22 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="현재 알레르기를 앓고 계신가요?" />
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
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveyAllergyOkScreen;

// 스타일 정의
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

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 38px;
`;
