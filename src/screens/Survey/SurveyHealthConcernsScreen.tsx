import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MultiSelectButton from '../../components/SelectButton/MultiSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

type RootStackParamList = {
  SurveyHealthConcernsScreen: undefined;
  NextSurveyScreen: undefined;
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

const SurveyHealthConcernsScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern],
    );
  };

  const handleNext = () => {
    console.log('Selected health concerns:', selectedConcerns);
    navigation.navigate('NextSurveyScreen');
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <SurveyHeader title="건강고민 & 목표" skipTarget="NextSurveyScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={13 / 24} />
      </ProgressBarContainer>

      {/* 질문 텍스트 */}
      <SurveyTitle text="현재 가장 신경쓰이는 건강고민이 무엇인가요?" />
      <SubText>(다중선택 가능)</SubText>

      {/* 다중 선택 버튼 */}
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

      {/* 공통 하단 버튼 */}
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
  margin-top: 52px;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
