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
  SurveyMedicationOkScreen: undefined;
  SurveyMedicationScreen: undefined;
  SurveySupplementOkScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyMedicationScreen'
>;

const medicationOptions = [
  '혈압약',
  '혈액응고제',
  '당뇨약',
  '갑상선 약',
  '스테로이드',
  '위장약',
  '우울증약',
  '피임약',
  '진통제',
];

const SurveyMedicationScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  const toggleMedication = (item: string) => {
    setSelectedMedications(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleNext = () => {
    console.log('Selected medications:', selectedMedications);
    navigation.navigate('SurveySupplementOkScreen');
  };

  return (
    <Container>
      {/* 헤더 */}
      <SurveyHeader
        title="복용약 & 건강기능식품 정보"
        skipTarget="NextSurveyScreen"
      />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={6 / 24} />
      </ProgressBarContainer>

      {/* 질문 */}
      <SurveyTitle text="현재 복용중이신 약을 선택해주세요." />
      <SubText>(다중선택 가능)</SubText>

      {/* 버튼 목록 */}
      <ButtonGrid>
        {medicationOptions.map(item => (
          <ButtonSpacing key={item}>
            <MultiSelectButton
              title={item}
              isSelected={selectedMedications.includes(item)}
              onPress={() => toggleMedication(item)}
            />
          </ButtonSpacing>
        ))}
      </ButtonGrid>

      {/* 버튼 그룹 */}
      <SurveyButtonGroupWrapper>
        <SurveyButtonGroup
          onPrevious={() => navigation.goBack()}
          onNext={handleNext}
          nextDisabled={selectedMedications.length === 0}
        />
      </SurveyButtonGroupWrapper>
    </Container>
  );
};

export default SurveyMedicationScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 65px;
`;

const SubText = styled.Text`
  font-size: 13px;
  color: #999999;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const ButtonGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 40px;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;

const SurveyButtonGroupWrapper = styled.View`
  margin-top: 8px;
`;
