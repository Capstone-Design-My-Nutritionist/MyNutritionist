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
  SurveyWaterScreen: undefined;
  SurveyDrinkScreen: undefined;
  SurveySmokingScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyDrinkScreen'
>;

const drinkOptionsTop = ['전혀 안함', '가끔'];
const drinkOptionsBottom = ['주 1~2회', '주 3회 이상'];

const SurveyDrinkScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Selected drinking frequency:', selectedOption);
      navigation.navigate('SurveySmokingScreen');
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={20 / 24} />
      </ProgressBarContainer>

      {/* 질문 */}
      <SurveyTitle text="음주를 얼마나 하시나요?" />

      {/* 선택 버튼 */}
      <ButtonWrapper>
        <ButtonRow>
          {drinkOptionsTop.map(option => (
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
          {drinkOptionsBottom.map(option => (
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

export default SurveyDrinkScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 72px;
`;

const ButtonWrapper = styled.View`
  flex: 0.7;
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
