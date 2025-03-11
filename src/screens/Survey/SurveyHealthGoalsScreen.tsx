import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MultiSelectButton from '../../components/SelectButton/MultiSelectButton';
import SurveyMultiButtonGroup from '../../components/Common/SurveyMultiButtonGroup';

type RootStackParamList = {
  SurveyHealthGoalsScreen: undefined;
  NextSurveyScreen: undefined;
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

const SurveyHealthGoalsScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal],
    );
  };

  const handleNext = () => {
    console.log('Selected health goals:', selectedGoals);
    navigation.navigate('NextSurveyScreen');
  };

  return (
    <Container>
      {/* ✅ 공통 헤더 */}
      <SurveyHeader title="건강고민 & 목표" skipTarget="NextSurveyScreen" />

      {/* ✅ 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={0.6} />
      </ProgressBarContainer>

      {/* ✅ 질문 텍스트 */}
      <SurveyTitle text="개선하고 싶은 건강목표는 무엇인가요?" />
      <SubText>(다중선택 가능)</SubText>

      {/* ✅ 다중선택 버튼 */}
      <ButtonGrid>
        {healthGoals.map(goal => (
          <MultiSelectButton
            key={goal}
            title={goal}
            isSelected={selectedGoals.includes(goal)}
            onPress={() => toggleGoal(goal)}
          />
        ))}
      </ButtonGrid>

      {/* ✅ 새 버튼 그룹 */}
      <SurveyMultiButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={selectedGoals.length === 0}
      />
    </Container>
  );
};

export default SurveyHealthGoalsScreen;

// ✅ 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
`;

const SubText = styled.Text`
  font-size: 13px;
  color: #999999;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const ButtonGrid = styled.View`
  flex: 0.5;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px 16px;
  margin-top: 52px;
`;
