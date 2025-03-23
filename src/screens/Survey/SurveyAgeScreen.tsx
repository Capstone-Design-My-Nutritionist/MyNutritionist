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
  SurveyGenderScreen: undefined;
  SurveyAgeScreen: undefined;
  SurveyHeightScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAgeScreen'
>;

const SurveyAgeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [age, setAge] = useState<number | null>(null);

  const handleNext = () => {
    if (age !== null) {
      console.log('Navigating to SurveyHeightScreen... Age:', age);
      navigation.navigate('SurveyHeightScreen');
    }
  };

  return (
    <Container>
      {/* 공통 헤더 사용 */}
      <SurveyHeader title="기본 정보" skipTarget="SurveyHeightScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={2 / 24} />
      </ProgressBarContainer>

      {/* 질문 텍스트 */}
      <SurveyTitle text="나이를 알려주세요." />

      {/* 나이 입력 필드 */}
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

      {/* 공통 버튼 그룹 */}
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
