import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MultiSelectButton from '../../components/SelectButton/MultiSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {getOrCreateSurvey, submitSurveyAnswer} from '../../utils/surveyUtils';

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
  '갑상선약',
  '스테로이드',
  '위장약',
  '우울증약',
  '피임약',
  '진통제',
];

// 백엔드에 보내야 하는 코드 매핑
const medicationMap: {[key: string]: string} = {
  혈압약: 'BLOOD_PRESSURE',
  혈액응고제: 'ANTICOAGULANT',
  당뇨약: 'DIABETES',
  갑상선약: 'THYROID',
  스테로이드: 'STEROID',
  위장약: 'GASTRIC',
  우울증약: 'DEPRESSION',
  피임약: 'CONTRACEPTIVE',
  진통제: 'PAINKILLER',
};

const SurveyMedicationScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  const toggleMedication = (item: string) => {
    setSelectedMedications(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleNext = async () => {
    if (selectedMedications.length === 0) return;

    const medicationCodes = selectedMedications.map(
      item => medicationMap[item],
    );

    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer(
        'medications',
        {medications: medicationCodes},
        surveyId,
      );
      console.log('✅ medications 저장 완료');
      navigation.navigate('SurveySupplementOkScreen');
    } catch (error) {
      console.error('❌ 설문 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader
        title="복용약 & 건강기능식품 정보"
        skipTarget="NextSurveyScreen"
      />
      <ProgressBarContainer>
        <ProgressBar progress={6 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="현재 복용중이신 약을 선택해주세요." />
      <SubText>(다중선택 가능)</SubText>

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
