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
  SurveyAgeScreen: undefined;
  SurveyHeightScreen: undefined;
  SurveyWeightScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyHeightScreen'
>;

const SurveyHeightScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [height, setHeight] = useState<number | null>(null);

  const handleNext = () => {
    if (height !== null) {
      console.log('Navigating to SurveyWeightScreen... Height:', height);
      navigation.navigate('SurveyWeightScreen');
    }
  };

  return (
    <Container>
      {/* 공통 헤더 */}
      <SurveyHeader title="기본 정보" skipTarget="SurveyWeightScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={3 / 24} />
      </ProgressBarContainer>

      {/* 질문 타이틀 */}
      <SurveyTitle text="키를 입력해주세요." />

      {/* 입력 필드 */}
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

      {/* 버튼 그룹 */}
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
