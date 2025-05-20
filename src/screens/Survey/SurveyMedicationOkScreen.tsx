import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer, getOrCreateSurvey} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyMedicationOkScreen: {from?: string};
  SurveyMedicationScreen: {from?: string};
  SurveySupplementOkScreen: {from?: string};
  ProfileScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyMedicationOkScreen'
>;

const SurveyMedicationOkScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const takingMedication = selectedOption === '예';

    try {
      const surveyId = await getOrCreateSurvey();

      // 1. 복용 여부 저장
      await submitSurveyAnswer(
        'medication-status',
        {takingMedication},
        surveyId,
      );

      if (takingMedication) {
        // 2. '예'인 경우 → 약 정보 입력 화면
        navigation.navigate(
          'SurveyMedicationScreen',
          from ? {from} : undefined,
        );
      } else {
        // 3. '아니오'인 경우 → 빈 배열로 저장 후 다음 단계
        await submitSurveyAnswer('medications', {medications: []}, surveyId);

        if (from === 'partial-medicine') {
          navigation.navigate(
            'SurveySupplementOkScreen',
            from ? {from} : undefined,
          );
        } else {
          navigation.navigate('SurveySupplementOkScreen');
        }
      }
    } catch (error) {
      console.error('❌ 약 정보 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="복용약" skipTarget="SurveySupplementOkScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={5 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="현재 복용 중인 약이 있나요?" />
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

export default SurveyMedicationOkScreen;

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
