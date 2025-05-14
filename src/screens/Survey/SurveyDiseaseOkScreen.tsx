import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer} from '../../utils/surveyUtils'; // ✅ 추가

type RootStackParamList = {
  SurveyDiseaseOkScreen: undefined;
  SurveyDiseaseScreen: undefined;
  SurveyFamilyHistoryOkScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyDiseaseOkScreen'
>;

const SurveyDiseaseOkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const hasDisease = selectedOption === '예';

    try {
      // 1. 질환 여부 저장
      await submitSurveyAnswer('diagnosed-disease-status', {
        hasDiagnosedDisease: hasDisease,
      });

      if (hasDisease) {
        // 2. '예'인 경우 → 상세 질환 입력 화면
        navigation.navigate('SurveyDiseaseScreen');
      } else {
        // 3. '아니오'인 경우 → 빈 배열 저장 후 다음 화면
        await submitSurveyAnswer('diseases', {
          diseases: [],
        });
        navigation.navigate('SurveyFamilyHistoryOkScreen'); // 다음 화면으로 변경 가능
      }
    } catch (error) {
      console.error('❌ 질환 여부 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader
        title="질병 & 건강정보"
        skipTarget="SurveyFamilyHistoryOkScreen"
      />

      <ProgressBarContainer>
        <ProgressBar progress={9 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="현재 진단받은 질환이 있나요?" />

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

export default SurveyDiseaseOkScreen;

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
