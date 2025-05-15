// 📦 알레르기 선택 저장 + 설문 완료
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단에 추가

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SmallMonoSelectButton from '../../components/SelectButton/SmallMonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {
  submitSurveyAnswer,
  saveSurveyCompletionTime,
} from '../../utils/surveyUtils';
import {completeSurvey} from '../../api/api'; // 파일 경로에 따라 조정

// ✅ 알레르기 맵핑
const allergyMap: Record<string, string> = {
  견과류: 'NUTS',
  유제품: 'DAIRY',
  갑각류: 'SHELLFISH',
  글루텐: 'GLUTEN',
  '해당 없음': 'NONE',
};

// ✅ Stack 타입
type RootStackParamList = {
  SurveyAllergyOkScreen: undefined;
  SurveyAllergyScreen: undefined;
  ProfileStack: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAllergyScreen'
>;

const allergyOptionsTop = ['견과류', '유제품', '갑각류'];
const allergyOptionsBottom = ['글루텐', '해당 없음'];

const SurveyAllergyScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    try {
      await submitSurveyAnswer('allergies', {
        allergies: [allergyMap[selectedOption]],
      });

      await completeSurvey();
      await saveSurveyCompletionTime();

      console.log('🎉 설문 완료!');
      await AsyncStorage.setItem('hasCompletedSurvey', 'true');
      navigation.replace('ProfileStack'); // ✅ 설문 완료 후 마이페이지로 이동
    } catch (error) {
      console.error('❌ 설문 완료 중 오류:', error);
    }
  };

  return (
    <Container>
      <SurveyHeader title="알레르기" skipTarget="NextSurveyScreen" />

      <ProgressBarContainer>
        <ProgressBar progress={23 / 24} />
      </ProgressBarContainer>

      <SurveyTitle text="어떤 알레르기를 앓고 계신가요?" />

      <ButtonWrapper>
        <ButtonRow>
          {allergyOptionsTop.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonRow>
        <ButtonRow>
          {allergyOptionsBottom.map(option => (
            <ButtonSpacing key={option}>
              <SmallMonoSelectButton
                title={option}
                isSelected={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </ButtonSpacing>
          ))}
        </ButtonRow>
      </ButtonWrapper>

      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedOption}
      />
    </Container>
  );
};

export default SurveyAllergyScreen;

// ---------------- 스타일 정의 ----------------
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 72px;
`;

const ButtonWrapper = styled.View`
  flex: 0.7;
  justify-content: center;
  align-items: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const ButtonSpacing = styled.View`
  margin: 20px 15px;
`;
