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
  SurveySupplementScreen: undefined;
  NextSurveyScreen: undefined;
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

const SurveySupplementScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  const toggleSupplement = (item: string) => {
    setSelectedSupplements(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleNext = () => {
    console.log('Selected supplements:', selectedSupplements);
    navigation.navigate('NextSurveyScreen');
  };

  return (
    <Container>
      {/* ✅ 헤더 */}
      <SurveyHeader
        title="복용약 & 건강기능식품 정보"
        skipTarget="NextSurveyScreen"
      />

      {/* ✅ 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={0.5} />
      </ProgressBarContainer>

      {/* ✅ 질문 */}
      <SurveyTitle text="현재 복용중이신 건강기능식품을 선택해주세요." />
      <SubText>(다중선택 가능)</SubText>

      {/* ✅ 버튼 목록 */}
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

      {/* ✅ 버튼 그룹 */}
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

// ✅ 스타일 정의
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
