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
  SurveyAllergyOkScreen: undefined;
  SurveyAllergyScreen: undefined;
  NextSurveyScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAllergyScreen'
>;

const allergyOptionsTop = ['견과류', '유제품', '갑각류'];
const allergyOptionsBottom = ['글루텐', '해당 없음'];

const SurveyAllergyScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      console.log('Selected allergy:', selectedOption);
      navigation.navigate('NextSurveyScreen');
    }
  };

  return (
    <Container>
      {/* 헤더 */}
      <SurveyHeader title="알레르기" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={23 / 24} />
      </ProgressBarContainer>

      {/* 질문 */}
      <SurveyTitle text="어떤 알레르기를 앓고 계신가요?" />

      {/* 선택 버튼 */}
      <ButtonWrapper>
        <ButtonRow>
          {allergyOptionsTop.map(option => (
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
          {allergyOptionsBottom.map(option => (
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

export default SurveyAllergyScreen;

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
