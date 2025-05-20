import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SurveyInputField from '../../components/TextInputBox/SurveyInputField';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer, getOrCreateSurvey} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyHeightScreen: undefined;
  SurveyWeightScreen: {from?: string} | undefined;
  SurveyMedicationOkScreen: undefined;
  ProfileScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyWeightScreen'
>;

const SurveyWeightScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [weight, setWeight] = useState<number | null>(null);

  const handleNext = async () => {
    if (weight === null) return;

    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer('weight', weight, surveyId);
      console.log('✅ 몸무게 저장 완료:', weight);

      if (from === 'partial-body') {
        // @ts-ignore
        navigation.navigate('ProfileStack', {
          screen: 'ProfileScreen',
        });
      } else {
        navigation.navigate('SurveyMedicationOkScreen');
      }
    } catch (error) {
      console.error('❌ 몸무게 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="기본 정보" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={4 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="몸무게를 입력해주세요." />
      <InputWrapper>
        <SurveyInputField
          label=""
          placeholder="몸무게를 입력해주세요.(소수점 제외)"
          value={weight !== null ? weight.toString() : ''}
          onChangeText={text => setWeight(text ? parseInt(text, 10) : 0)}
          keyboardType="numeric"
        />
        <UnitText>kg</UnitText>
      </InputWrapper>
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={weight === null}
      />
    </Container>
  );
};

export default SurveyWeightScreen;

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
