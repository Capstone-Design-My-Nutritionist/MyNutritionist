import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native'; // 🔥 추가

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer, getOrCreateSurvey} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyGenderScreen: {from?: string};
  SurveyAgeScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyGenderScreen'
>;

// ✅ 🔽 이 부분이 중요! useRoute 타입 지정
type RouteProps = RouteProp<RootStackParamList, 'SurveyGenderScreen'>;

const SurveyGenderScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>(); // ✅ 타입 명시

  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const from = route.params?.from; // 이제 에러 X

  const genderMap: {[key: string]: string} = {
    남성: 'MALE',
    여성: 'FEMALE',
  };

  const handleNext = async () => {
    if (!selectedGender) return;

    try {
      const mappedGender = genderMap[selectedGender];

      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer('gender', mappedGender, surveyId);

      navigation.navigate('SurveyAgeScreen', {from}); // 다음 스크린에도 전달
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
