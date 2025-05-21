import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import ProgressBar from '../../components/ProgressBar';
import SmallMonoSelectButton from '../../components/SelectButton/SmallMonoSelectButton';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';
import {
  submitSurveyAnswer,
  saveSurveyCompletionTime,
  getOrCreateSurvey,
} from '../../utils/surveyUtils';
import {completeSurvey} from '../../api/api';

const allergyMap: Record<string, string> = {
  견과류: 'NUTS',
  유제품: 'DAIRY',
  갑각류: 'SHELLFISH',
  글루텐: 'GLUTEN',
  '해당 없음': 'NONE',
};

type RootStackParamList = {
  SurveyAllergyOkScreen: undefined;
  SurveyAllergyScreen: {from?: string};
  SurveySmokingScreen: undefined;
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
  const route = useRoute();
  const from = (route.params as {from?: string})?.from;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedOption) return;

    try {
      const surveyId = await getOrCreateSurvey();
      await submitSurveyAnswer('allergies', {
        allergies: [allergyMap[selectedOption]],
      });

      if (from === 'partial-health') {
        // 건강정보 설문만 다시 하는 경우
        await completeSurvey(surveyId);
        await saveSurveyCompletionTime();
        console.log('🎉 건강정보 설문 완료!');
        await AsyncStorage.setItem('hasCompletedSurvey', 'true');
        navigation.replace('ProfileStack');
      } else {
        // 전체 설문 흐름
        navigation.navigate('ProfileStack');
      }
    } catch (error) {
      console.error('❌ 알레르기 저장/설문 완료 중 오류:', error);
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
