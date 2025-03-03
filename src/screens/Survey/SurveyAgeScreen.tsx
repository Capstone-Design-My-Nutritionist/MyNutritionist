import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import ProgressBar from '../../components/ProgressBar';
import SurveyInputField from '../../components/TextInputBox/SurveyInputField';
import PrimaryButton from '../../components/Button/PrimaryButton';
import OutlineButton from '../../components/Button/OutlineButton';

// ✅ 네비게이션 스택 타입 정의
type RootStackParamList = {
  SurveyGenderScreen: undefined;
  SurveyAgeScreen: undefined;
  SurveyHeightScreen: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'SurveyAgeScreen'
>;

const SurveyAgeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [age, setAge] = useState<number | null>(null);

  const handleNext = () => {
    if (age !== null) {
      console.log('Navigating to SurveyHeightScreen... Age:', age);
      navigation.navigate('SurveyHeightScreen');
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <Header>
        <HeaderTitleContainer>
          <HeaderTitle>기본 정보</HeaderTitle>
        </HeaderTitleContainer>
        <SkipButton onPress={() => navigation.navigate('SurveyHeightScreen')}>
          <SkipText>skip &gt;</SkipText>
        </SkipButton>
      </Header>

      {/* 진행 바 */}
      <ProgressBarContainer>
        <ProgressBar progress={0.2} />
      </ProgressBarContainer>

      {/* 질문 텍스트 */}
      <TitleContainer>
        <Title>나이를 알려주세요.</Title>
      </TitleContainer>

      {/* 나이 입력 필드 */}
      <InputWrapper>
        <SurveyInputField
          label=""
          placeholder="나이를 입력해 주세요."
          value={age !== null ? age.toString() : ''} // ✅ 빈 문자열로 기본값 설정
          onChangeText={text => setAge(text ? parseInt(text, 10) : 0)} // ✅ null 대신 0으로 변환
          keyboardType="numeric"
        />
        <UnitText>세</UnitText>
      </InputWrapper>

      {/* 하단 네비게이션 버튼 */}
      <NavigationButtons>
        <OutlineButton label="이전" onPress={() => navigation.goBack()} />
        <PrimaryButton
          label="다음"
          onPress={handleNext}
          disabled={age === null}
        />
      </NavigationButtons>
    </Container>
  );
};

export default SurveyAgeScreen;

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

const InputWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 0.5;
  gap: 8px;
`;

const UnitText = styled.Text`
  font-size: 24px;
  font-family: 'Pretendard-Bold';
  color: #111111;
`;

const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
`;
