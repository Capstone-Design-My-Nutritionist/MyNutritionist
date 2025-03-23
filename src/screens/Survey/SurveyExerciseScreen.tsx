import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SmallMonoSelectButton from '../../components/SelectButton/SmallMonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

type RootStackParamList = {
  SurveyExerciseScreen: undefined;
  NextSurveyScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyExerciseScreen'
>;

const exerciseOptionsTop = [
  '거의 하지 않음',
  '1~3회\n\n가벼운 운동',
  '3~5회\n\n보통강도',
];
const exerciseOptionsBottom = [
  '6~7회\n\n강도높은 운동',
  '매일\n\n활동적이거나\n운동선수',
];

const SurveyExerciseScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Selected exercise frequency:', selectedOption);
      navigation.navigate('NextSurveyScreen');
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={16 / 24} />
      </ProgressBarContainer>

      {/* 질문 */}
      <SurveyTitle text="주당 운동 빈도는 어떻게 되시나요?" />

      {/* 선택 버튼 */}
      <ButtonWrapper>
        <ButtonRow>
          {exerciseOptionsTop.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonRow>
        <ButtonRow>
          {exerciseOptionsBottom.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonRow>
      </ButtonWrapper>

      {/* 하단 버튼 */}
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveyExerciseScreen;

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

const ButtonWrapper = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
