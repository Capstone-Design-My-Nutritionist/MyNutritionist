import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SurveyInputField from '../../components/TextInputBox/SurveyInputField';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyExerciseScreen: {from?: string};
  SurveyMealScreen: {from?: string};
  SurveyVegetableScreen: {from?: string};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyMealScreen'
>;

const SurveyMealScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [mealCount, setMealCount] = useState<number | null>(null);

  const handleNext = async () => {
    if (mealCount !== null) {
      try {
        await submitSurveyAnswer('meal-count', {mealCount});
        console.log('✅ mealCount 저장 완료:', mealCount);
        navigation.navigate('SurveyVegetableScreen', from ? {from} : undefined);
      } catch (error) {
        console.error('❌ mealCount 저장 실패:', error);
      }
    }
  };

  return (
    <Container>
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={17 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="하루에 평균 몇 끼를 드시나요?" />

      <InputWrapper>
        <SurveyInputField
          label=""
          placeholder="횟수를 입력해주세요."
          value={mealCount !== null ? mealCount.toString() : ''}
          onChangeText={text => setMealCount(text ? parseInt(text, 10) : null)}
          keyboardType="numeric"
        />
        <UnitText>끼</UnitText>
      </InputWrapper>

      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={mealCount === null}
      />
    </Container>
  );
};

export default SurveyMealScreen;

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
