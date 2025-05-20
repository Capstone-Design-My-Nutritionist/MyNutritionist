import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SurveyInputField from '../../components/TextInputBox/SurveyInputField';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer, getOrCreateSurvey} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyGenderScreen: {from?: string};
  SurveyAgeScreen: {from?: string};
  SurveyHeightScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAgeScreen'
>;

type RouteProps = RouteProp<RootStackParamList, 'SurveyAgeScreen'>;

const SurveyAgeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const [age, setAge] = useState<number | null>(null);

  const from = route.params?.from;

  const handleNext = async () => {
    if (age === null) return;

    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer('age', age, surveyId);
      console.log('✅ 나이 저장 완료:', age);

      navigation.navigate('SurveyHeightScreen', {from}); // ✅ 다음으로 from 전달
    } catch (error) {
      console.error('❌ 나이 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="기본 정보" skipTarget="SurveyHeightScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={2 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="나이를 알려주세요." />

      <InputWrapper>
        <SurveyInputField
          label=""
          placeholder="나이를 입력해 주세요."
          value={age !== null ? age.toString() : ''}
          onChangeText={text => setAge(text ? parseInt(text, 10) : 0)}
          keyboardType="numeric"
        />
        <UnitText>세</UnitText>
      </InputWrapper>

      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={age === null}
      />
    </Container>
  );
};

export default SurveyAgeScreen;

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

const InputWrapper = styled.View`
  flex: 0.7;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const UnitText = styled.Text`
  font-size: 24px;
  font-family: 'Pretendard-Bold';
  color: #111111;
`;
