import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyDiseaseScreen: undefined;
  SurveyFamilyHistoryOkScreen: {from?: string};
  SurveyFamilyHistoryScreen: {from?: string};
  SurveyHealthConcernsScreen: undefined;
  ProfileScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyFamilyHistoryOkScreen'
>;

const SurveyFamilyHistoryOkScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    const hasFamilyHistory = selectedOption === '예';

    try {
      // 1. 저장
      await submitSurveyAnswer('family-history-status', {
        hasFamilyHistory,
      });

      if (hasFamilyHistory) {
        // 2. 상세 입력으로
        navigation.navigate(
          'SurveyFamilyHistoryScreen',
          from ? {from} : undefined,
        );
      } else {
        // 3. 아니오 → 빈 배열 저장 후 다음 화면
        await submitSurveyAnswer('family-histories', {
          familyDiseases: [],
        });

        if (from === 'partial-health') {
          navigation.navigate('SurveyAllergyOkScreen', {from});
        } else {
          navigation.navigate('SurveyHealthConcernsScreen');
        }
      }
    } catch (error) {
      console.error('❌ 가족력 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader
        title="질병 & 건강정보"
        skipTarget="SurveyHealthConcernsScreen"
      />

      <ProgressBarContainer>
        <ProgressBar progress={11 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="가족력(유전적 질병 위험)이 있나요?" />

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

export default SurveyFamilyHistoryOkScreen;

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
