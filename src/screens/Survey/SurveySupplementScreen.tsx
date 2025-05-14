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
  SurveySupplementOkScreen: undefined;
  SurveySupplementScreen: undefined;
  SurveyDiseaseOkScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveySupplementScreen'
>;

const supplementOptions = [
  '오메가-3',
  '비타민K',
  '마그네슘',
  '칼슘',
  '철분',
  '비타민C',
  '프로바이오틱스',
  '비타민D',
  '홍삼(인삼)',
];

const supplementMap: {[key: string]: string} = {
  '오메가-3': 'OMEGA3',
  비타민K: 'VITAMIN_K',
  마그네슘: 'MAGNESIUM',
  칼슘: 'CALCIUM',
  철분: 'IRON',
  비타민C: 'VITAMIN_C',
  프로바이오틱스: 'PROBIOTICS',
  비타민D: 'VITAMIN_D',
  '홍삼(인삼)': 'GINSENG',
};

const SurveySupplementScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  const toggleSupplement = (item: string) => {
    setSelectedSupplements(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleNext = async () => {
    if (selectedSupplements.length === 0) return;

    const supplementCodes = selectedSupplements.map(
      item => supplementMap[item],
    );

    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer(
        'supplements',
        {supplements: supplementCodes},
        surveyId,
      );
      console.log('✅ supplements 저장 완료');
      navigation.navigate('SurveyDiseaseOkScreen');
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
        <ProgressBar progress={8 / 24} />
      </ProgressBarContainer>
      <SurveyTitle text="현재 복용중이신 건강기능식품을 선택해주세요." />
      <SubText>(다중선택 가능)</SubText>

      <ButtonGrid>
        {supplementOptions.map(item => (
          <ButtonSpacing key={item}>
            <MultiSelectButton
              title={item}
              isSelected={selectedSupplements.includes(item)}
              onPress={() => toggleSupplement(item)}
            />
          </ButtonSpacing>
        ))}
      </ButtonGrid>

      <SurveyButtonGroupWrapper>
        <SurveyButtonGroup
          onPrevious={() => navigation.goBack()}
          onNext={handleNext}
          nextDisabled={selectedSupplements.length === 0}
        />
      </SurveyButtonGroupWrapper>
    </Container>
  );
};

export default SurveySupplementScreen;

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
