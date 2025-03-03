import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import PrimaryButton from '../../components/Button/PrimaryButton';
import OutlineButton from '../../components/Button/OutlineButton';

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
      {/* 상단 헤더 */}
      <Header>
        <HeaderTitleContainer>
          <HeaderTitle>기본 정보</HeaderTitle>
        </HeaderTitleContainer>
        <SkipButton onPress={() => navigation.navigate('SurveyAgeScreen')}>
          <SkipText>skip &gt;</SkipText>
        </SkipButton>
      </Header>

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={0.1} />
      </ProgressBarContainer>

      {/* 질문 텍스트 */}
      <TitleContainer>
        <Title>성별을 알려주세요.</Title>
      </TitleContainer>

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

      {/* 하단 네비게이션 버튼 */}
      <NavigationButtons>
        <OutlineButton label="이전" onPress={() => navigation.goBack()} />
        <PrimaryButton
          label="다음"
          onPress={handleNext}
          disabled={!selectedGender}
        />
      </NavigationButtons>
    </Container>
  );
};

export default SurveyGenderScreen;

// ✅ 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const HeaderTitleContainer = styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  width: 100%;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #a83232;
  text-align: center;
`;

const SkipButton = styled.TouchableOpacity`
  z-index: 1;
  margin-left: auto;
`;

const SkipText = styled.Text`
  color: #a83232;
  font-size: 16px;
  font-weight: bold;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-top: 10px;
`;

const TitleContainer = styled.View`
  flex: 0.15;
  justify-content: flex-end;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #a83232;
  text-align: center;
`;

const ButtonWrapper = styled.View`
  flex: 0.5;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 24px;
`;

const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
`;
