import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import SurveyHeader from '../../components/Common/SurveyHeader';
import SurveyTitle from '../../components/Common/SurveyTitle';
import SurveyButtonGroup from '../../components/Common/SurveyButtonGroup';

type RootStackParamList = {
  SurveyGenderScreen: undefined;
  SurveyAgeScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyGenderScreen'
>;

const SurveyGenderScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      console.log('Navigating to SurveyAgeScreen...');
      navigation.navigate('SurveyAgeScreen');
    }
  };

  return (
    <Container>
      {/* 공통 헤더 사용 */}
      <SurveyHeader title="기본 정보" skipTarget="SurveyAgeScreen" />

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={1 / 24} />
      </ProgressBarContainer>

      {/* 공통 질문 텍스트 사용 */}
      <SurveyTitle text="성별을 알려주세요." />

      {/* 성별 선택 버튼 */}
      <ButtonWrapper>
        <ButtonContainer>
          <MonoSelectButton
            title="남성"
            isSelected={selectedGender === '남성'}
            onPress={() => setSelectedGender('남성')}
          />
          <MonoSelectButton
            title="여성"
            isSelected={selectedGender === '여성'}
            onPress={() => setSelectedGender('여성')}
          />
        </ButtonContainer>
      </ButtonWrapper>

      {/* 공통 버튼 그룹 사용 */}
      <SurveyButtonGroup
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!selectedGender}
      />
    </Container>
  );
};

export default SurveyGenderScreen;

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

const ButtonWrapper = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 38px;
`;
