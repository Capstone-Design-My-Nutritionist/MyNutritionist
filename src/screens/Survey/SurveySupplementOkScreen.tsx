import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer} from '../../utils/surveyUtils';

// ✅ 네비게이션 타입 정의
type RootStackParamList = {
  SurveySupplementOkScreen: undefined;
  SurveySupplementScreen: undefined;
  SurveyDiseaseOkScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveySupplementOkScreen'
>;

const SurveySupplementOkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const takingSupplements = selectedOption === '예';

    try {
      // 1. 복용 여부 저장
      await submitSurveyAnswer('supplement-status', {
        takingSupplements: takingSupplements,
      });

      if (takingSupplements) {
        // 2. '예'인 경우 → 복용 목록 입력 화면으로 이동
        navigation.navigate('SurveySupplementScreen');
      } else {
        // 3. '아니오'인 경우 → 빈 배열 저장 + 다음 화면 이동
        await submitSurveyAnswer('supplements', {
          supplements: [],
        });
        navigation.navigate('SurveyDiseaseOkScreen');
      }
    } catch (error) {
      console.error('❌ 영양제 정보 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="영양제" skipTarget="SurveyDiseaseOkScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={7 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="현재 복용 중인 영양제가 있나요?" />

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

export default SurveySupplementOkScreen;

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
