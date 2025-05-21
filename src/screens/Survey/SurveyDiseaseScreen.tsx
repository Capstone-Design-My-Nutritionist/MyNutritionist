import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import MultiSelectButton from '../../components/SelectButton/MultiSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

import {submitSurveyAnswer} from '../../utils/surveyUtils';

type RootStackParamList = {
  SurveyDiseaseOkScreen: undefined;
  SurveyDiseaseScreen: {from?: string} | undefined;
  SurveyFamilyHistoryOkScreen: {from?: string}; // ✅ from 추가
  ProfileStack: {
    screen: 'ProfileScreen';
  };
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyDiseaseScreen'
>;

const diseaseOptions: {[k: string]: string} = {
  당뇨병: 'DIABETES',
  고혈압: 'HYPERTENSION',
  고지혈증: 'HYPERLIPIDEMIA',
  '갑상선 질환': 'THYROID_DISEASE',
  골다공증: 'OSTEOPOROSIS',
  빈혈: 'ANEMIA',
  '위장 장애': 'GASTRIC_DISORDER',
  '간 질환': 'LIVER_DISEASE',
  '신장 질환': 'KIDNEY_DISEASE',
};

const SurveyDiseaseScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);

  const toggleDisease = (item: string) => {
    setSelectedDiseases(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleNext = async () => {
    try {
      if (selectedDiseases.includes('해당 없음')) {
        await submitSurveyAnswer('diseases', {diseases: []});
      } else {
        const diseaseCodes = selectedDiseases
          .map(label => diseaseOptions[label])
          .filter(code => !!code);
        await submitSurveyAnswer('diseases', {diseases: diseaseCodes});
      }

      navigation.navigate('SurveyFamilyHistoryOkScreen', {from});
    } catch (error) {
      console.error('❌ 질환 저장 실패:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="질병 & 건강정보" skipTarget="NextSurveyScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={10 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="진단받은 질환을 선택해주세요." />
      <SubText>(다중선택 가능)</SubText>

      <ButtonGrid>
        {Object.keys(diseaseOptions)
          .concat('해당 없음')
          .map(item => (
            <ButtonSpacing key={item}>
              <MultiSelectButton
                title={item}
                isSelected={selectedDiseases.includes(item)}
                onPress={() => toggleDisease(item)}
              />
            </ButtonSpacing>
          ))}
      </ButtonGrid>

      <SurveyButtonGroupWrapper>
        <SurveyButtonGroup
          onPrevious={() => navigation.goBack()}
          onNext={handleNext}
          nextDisabled={selectedDiseases.length === 0}
        />
      </SurveyButtonGroupWrapper>
    </Container>
  );
};

export default SurveyDiseaseScreen;

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
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
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ButtonSpacing = styled.View`
  margin: 15px 15px;
`;

const SurveyButtonGroupWrapper = styled.View`
  margin-top: 8px;
`;
