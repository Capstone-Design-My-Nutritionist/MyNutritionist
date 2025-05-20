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
  SurveyAgeScreen: undefined;
  SurveyHeightScreen: {from?: string}; // <- from 추가
  SurveyWeightScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyHeightScreen'
>;

const SurveyHeightScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute(); // <- route 가져오기
  const from = (route.params as any)?.from;

  const [height, setHeight] = useState<number | null>(null);

  const handleNext = async () => {
    if (height === null) return;

    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer('height', height, surveyId);
      console.log('✅ 키 저장 완료:', height);

      navigation.navigate('SurveyWeightScreen', from ? {from} : {}); // ✅ 여기 수정
    } catch (error) {
      console.error('❌ 키 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="기본 정보" skipTarget="SurveyWeightScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={3 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="키를 입력해주세요." />

      <InputWrapper>
        <SurveyInputField
          label=""
          placeholder="키를 입력해주세요."
          value={height !== null ? height.toString() : ''}
          onChangeText={text => setHeight(text ? parseInt(text, 10) : 0)}
          keyboardType="numeric"
        />
        <UnitText>cm</UnitText>
      </InputWrapper>

      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={height === null}
      />
    </Container>
  );
};

export default SurveyHeightScreen;

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
