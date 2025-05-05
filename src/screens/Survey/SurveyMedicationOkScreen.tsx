import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {getOrCreateSurvey, submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyMedicationOkScreen: undefined;
  SurveyMedicationScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyMedicationOkScreen'
>;

const SurveyMedicationOkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const isTaking = selectedOption === '예'; // 문자열 → boolean 변환

    try {
      const surveyId = await getOrCreateSurvey();

      // 명세에 따라 medication-status 엔드포인트로 PATCH 요청
      await submitSurveyAnswer(
        'medication-status',
        {takingMedication: isTaking},
        surveyId,
      );

      console.log('✅ medication-status 저장 완료');
      navigation.navigate('SurveyMedicationScreen');
    } catch (error) {
      console.error('❌ 설문 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader
        title="복용약 & 건강기능식품 정보"
        skipTarget="SurveyMedicationScreen"
      />
      <ProgressBarContainer>
        <ProgressBar progress={5 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="현재 복용 중이신 약이 있으신가요?" />
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
