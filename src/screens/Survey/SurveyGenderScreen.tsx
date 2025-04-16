import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {createSurvey} from '../../api/api';
import {setSurveyId, submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyGenderScreen: undefined;
  SurveyAgeScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyGenderScreen'
>;

const SurveyGenderScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const genderMap: {[key: string]: string} = {
    남성: 'MALE',
    여성: 'FEMALE',
  };

  const handleNext = async () => {
    if (!selectedGender) return;

    try {
      const mappedGender = genderMap[selectedGender];

      // 1. 설문 생성
      const surveyId = await createSurvey();
      await setSurveyId(surveyId);
      console.log('생성된 surveyId:', surveyId);

      // 2. gender 답변 저장
      await submitSurveyAnswer('gender', mappedGender);

      // 3. 다음 화면으로 이동
      navigation.navigate('SurveyAgeScreen');
    } catch (error) {
      console.error('❌ 설문 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="기본 정보" skipTarget="SurveyAgeScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={1 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="성별을 알려주세요." />
      <ButtonWrapper>
        <ButtonContainer>
          <MonoSelectButton
            title="남성"
            isSelected={selectedGender === '남성'}
            onPress={() => setSelectedGender('남성')}
          />
          <MonoSelectButton
            title="여성"
            isSelected={selectedGender === '여성'}
            onPress={() => setSelectedGender('여성')}
          />
        </ButtonContainer>
      </ButtonWrapper>
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedGender}
      />
    </Container>
  );
};

export default SurveyGenderScreen;

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
