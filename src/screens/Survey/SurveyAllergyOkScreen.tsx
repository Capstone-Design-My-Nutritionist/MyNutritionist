import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {
  submitSurveyAnswer,
  saveSurveyCompletionTime,
} from '../../utils/surveyUtils';
import {completeSurvey} from '../../api/api';

type RootStackParamList = {
  SurveySmokingScreen: undefined;
  SurveyAllergyOkScreen: {from?: string};
  SurveyAllergyScreen: {from?: string};
  ProfileStack: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAllergyOkScreen'
>;

const SurveyAllergyOkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const hasAllergy = selectedOption === '예';

    try {
      await submitSurveyAnswer('allergy-status', {hasAllergy});

      if (hasAllergy) {
        // 알레르기 상세 화면으로 이동 (분기 흐름 고려)
        navigation.navigate('SurveyAllergyScreen', {from});
      } else {
        // 빈 배열 저장
        await submitSurveyAnswer('allergies', {allergies: []});

        if (from === 'partial-health') {
          // 분기 흐름이면 설문 완료 처리 후 마이페이지로
          await completeSurvey();
          await saveSurveyCompletionTime();
          console.log('🎉 건강정보 설문 완료!');
          navigation.navigate('ProfileStack');
        } else {
          // 전체 흐름에서는 다음 단계로 (SmokingScreen 등)
          navigation.navigate('SurveySmokingScreen');
        }
      }
    } catch (error) {
      console.error('❌ 알레르기 저장/완료 중 오류:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="알레르기 정보" skipTarget="ProfileStack" />
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
