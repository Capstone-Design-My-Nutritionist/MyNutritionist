import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
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
import {completeSurvey} from '../../api/api'; // ✅ 설문 완료 API

type RootStackParamList = {
  SurveySmokingScreen: undefined;
  SurveyAllergyOkScreen: undefined;
  SurveyAllergyScreen: undefined;
  ProfileStack: undefined; // ✅ 프로필 스택으로 이동
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
      // 1. 알레르기 여부 저장
      await submitSurveyAnswer('allergy-status', {hasAllergy});

      if (hasAllergy) {
        // 2. 예 → 상세 알레르기 입력
        navigation.navigate('SurveyAllergyScreen');
      } else {
        // 3. 아니오 → 빈 배열 저장 & 설문 완료 처리
        await submitSurveyAnswer('allergies', {allergies: []});
        await completeSurvey(); // ✅ 설문 완료 API
        await saveSurveyCompletionTime(); // ✅ 로컬 저장
        console.log('🎉 설문 완료! 프로필로 이동');
        navigation.navigate('ProfileStack'); // ✅ 프로필로 이동
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

// ---------------- 스타일 정의 ----------------
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
