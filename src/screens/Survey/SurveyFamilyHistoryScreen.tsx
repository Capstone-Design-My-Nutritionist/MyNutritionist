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
  SurveyFamilyHistoryOkScreen: undefined;
  SurveyFamilyHistoryScreen: undefined;
  SurveyHealthConcernsScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyFamilyHistoryScreen'
>;

const familyHistoryOptions = [
  '당뇨병',
  '고혈압',
  '심혈관 질환',
  '갑상선 질환',
  '골다공증',
  '고지혈증',
  '암',
  '알츠하이머병',
  '신장 질환',
];

// 서버에 보낼 값으로 매핑
const mapToApiValue = (korean: string): string => {
  switch (korean) {
    case '당뇨병':
      return 'DIABETES';
    case '고혈압':
      return 'HYPERTENSION';
    case '심혈관 질환':
      return 'CARDIOVASCULAR';
    case '갑상선 질환':
      return 'THYROID_DISEASE';
    case '골다공증':
      return 'OSTEOPOROSIS';
    case '고지혈증':
      return 'HYPERLIPIDEMIA';
    case '암':
      return 'CANCER';
    case '알츠하이머병':
      return 'ALZHEIMER';
    case '신장 질환':
      return 'KIDNEY_DISEASE';
    default:
      return '';
  }
};

const SurveyFamilyHistoryScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);

  const toggleHistory = (item: string) => {
    setSelectedHistory(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleNext = async () => {
    const apiValues = selectedHistory.map(mapToApiValue).filter(Boolean);
    try {
      await submitSurveyAnswer('family-histories', {
        familyDiseases: apiValues,
      });
      navigation.navigate('SurveyHealthConcernsScreen');
    } catch (error) {
      console.error('❌ 가족력 질환 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="질병 & 건강정보" skipTarget="NextSurveyScreen" />
      <ProgressBarContainer>
        <ProgressBar progress={12 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="가족력이 있는 질환을 선택해주세요." />
      <SubText>(다중선택 가능)</SubText>

      <ButtonGrid>
        {familyHistoryOptions.map(item => (
          <ButtonSpacing key={item}>
            <MultiSelectButton
              title={item}
              isSelected={selectedHistory.includes(item)}
              onPress={() => toggleHistory(item)}
            />
          </ButtonSpacing>
        ))}
      </ButtonGrid>

      <SurveyButtonGroupWrapper>
        <SurveyButtonGroup
          onPrevious={() => navigation.goBack()}
          onNext={handleNext}
          nextDisabled={selectedHistory.length === 0}
        />
      </SurveyButtonGroupWrapper>
    </Container>
  );
};

export default SurveyFamilyHistoryScreen;

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
