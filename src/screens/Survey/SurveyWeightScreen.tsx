import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SurveyInputField from '../../components/TextInputBox/SurveyInputField';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

type RootStackParamList = {
  SurveyHeightScreen: undefined;
  SurveyWeightScreen: undefined;
  SurveyMedicationOkScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyWeightScreen'
>;

const SurveyWeightScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [weight, setWeight] = useState<number | null>(null);

  const handleNext = () => {
    if (weight !== null) {
      console.log('Navigating to NextSurveyScreen... Weight:', weight);
      navigation.navigate('SurveyMedicationOkScreen');
    }
  };

  return (
    <Container>
      {/* 공통 헤더 */}
      <SurveyHeader title="기본 정보" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={4 / 24} />
      </ProgressBarContainer>

      {/* 질문 텍스트 */}
      <SurveyTitle text="몸무게를 입력해주세요." />

      {/* 입력 필드 */}
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

      {/* 버튼 그룹 */}
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
`;

const InputWrapper = styled.View`
  flex: 0.5;
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
