import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MultiSelectButton from '../../components/SelectButton/MultiSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyHealthConcernsScreen: undefined;
  SurveyHealthGoalsScreen: undefined;
  SurveySleepTimeScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyHealthGoalsScreen'
>;

const healthGoals = [
  '체중 조절',
  '근육 증가',
  '에너지 증진',
  '혈압 조절',
  '소화 개선',
  '면역력 강화',
];

// 한글 → API ENUM 변환
const mapGoalToApiValue = (goal: string): string => {
  switch (goal) {
    case '체중 조절':
      return 'WEIGHT_CONTROL';
    case '근육 증가':
      return 'MUSCLE_GAIN';
    case '에너지 증진':
      return 'ENERGY';
    case '혈압 조절':
      return 'BLOOD_PRESSURE_CONTROL';
    case '소화 개선':
      return 'DIGESTIVE_HEALTH';
    case '면역력 강화':
      return 'IMMUNE_SUPPORT';
    default:
      return '';
  }
};

const SurveyHealthGoalsScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal],
    );
  };

  const handleNext = async () => {
    const apiValues = selectedGoals.map(mapGoalToApiValue).filter(Boolean);
    try {
      await submitSurveyAnswer('goals', {goals: apiValues});
      navigation.navigate('SurveySleepTimeScreen');
    } catch (error) {
      console.error('❌ 건강 목표 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="건강고민 & 목표" skipTarget="NextSurveyScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={14 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="개선하고 싶은 건강목표는 무엇인가요?" />
      <SubText>(다중선택 가능)</SubText>

      <ButtonGrid>
        {healthGoals.map(goal => (
          <ButtonSpacing key={goal}>
            <MultiSelectButton
              title={goal}
              isSelected={selectedGoals.includes(goal)}
              onPress={() => toggleGoal(goal)}
            />
          </ButtonSpacing>
        ))}
      </ButtonGrid>

      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={selectedGoals.length === 0}
      />
    </Container>
  );
};

export default SurveyHealthGoalsScreen;

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
