import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MultiSelectButton from '../../components/SelectButton/MultiSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer, getOrCreateSurvey} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyFamilyHistoryScreen: undefined;
  SurveyHealthConcernsScreen: {from?: string};
  SurveyHealthGoalsScreen: {from?: string};
  ProfileStack: {screen: 'ProfileScreen'};
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyHealthConcernsScreen'
>;

const healthConcerns = [
  '피로감',
  '체중 조절',
  '소화 문제',
  '면역력 저하',
  '수면 문제',
  '피부 문제',
];

const mapToApiValue = (korean: string): string => {
  switch (korean) {
    case '피로감':
      return 'FATIGUE';
    case '체중 조절':
      return 'WEIGHT_CONTROL';
    case '소화 문제':
      return 'DIGESTIVE_PROBLEM';
    case '면역력 저하':
      return 'IMMUNITY';
    case '수면 문제':
      return 'SLEEP';
    case '피부 문제':
      return 'SKIN_PROBLEM';
    default:
      return '';
  }
};

const SurveyHealthConcernsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern],
    );
  };

  const handleNext = async () => {
    const apiValues = selectedConcerns.map(mapToApiValue).filter(Boolean);
    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer('concerns', {concerns: apiValues}, surveyId);

      if (from === 'partial-goal') {
        navigation.navigate(
          'SurveyHealthGoalsScreen',
          from ? {from} : undefined,
        );
      } else {
        navigation.navigate('SurveyHealthGoalsScreen');
      }
    } catch (error) {
      console.error('❌ 건강 고민 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="건강고민 & 목표" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={13 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="현재 가장 신경쓰이는 건강고민이 무엇인가요?" />
      <SubText>(다중선택 가능)</SubText>
      <ButtonGrid>
        {healthConcerns.map(concern => (
          <ButtonSpacing key={concern}>
            <MultiSelectButton
              title={concern}
              isSelected={selectedConcerns.includes(concern)}
              onPress={() => toggleConcern(concern)}
            />
          </ButtonSpacing>
        ))}
      </ButtonGrid>
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={selectedConcerns.length === 0}
      />
    </Container>
  );
};

export default SurveyHealthConcernsScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 64px;
`;

const SubText = styled.Text`
  font-size: 13px;
  color: #999999;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const ButtonGrid = styled.View`
  flex: 0.7;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 52px;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
