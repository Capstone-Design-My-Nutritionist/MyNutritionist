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
  NextSurveyScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyWaterScreen'
>;

const waterOptions = ['1L 이하', '1~2L', '2L 이상'];

const SurveyWaterScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Selected water intake:', selectedOption);
      navigation.navigate('NextSurveyScreen');
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <SurveyHeader title="생활 습관" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={19 / 24} />
      </ProgressBarContainer>

      {/* 질문 */}
      <SurveyTitle text="하루 물 섭취량이 어느 정도 되시나요?" />

      {/* 선택 버튼 */}
      <ButtonWrapper>
        <ButtonGrid>
          {waterOptions.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonGrid>
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

export default SurveyWaterScreen;

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

const ButtonGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
