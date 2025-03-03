import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

import ProgressBar from '../../components/ProgressBar';
import MonoSelectButton from '../../components/SelectButton/MonoSelectButton';
import PrimaryButton from '../../components/Button/PrimaryButton';
import OutlineButton from '../../components/Button/OutlineButton';

const SurveyGenderScreen = () => {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      // TODO: 선택한 값 저장 후 다음 화면으로 이동
      // navigation.navigate('SurveyAgeScreen'); // ✅ 다음 설문 화면으로 이동
    }
  };

  return (
    <Container>
      <Header>
        {/* <SkipButton onPress={() => navigation.navigate('SurveyAgeScreen')}>
          <SkipText>skip &gt;</SkipText>
        </SkipButton> */}
      </Header>

      <ProgressBar progress={0.1} />

      <Title>성을 알려주세요.</Title>

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
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const SkipButton = styled.TouchableOpacity``;

const SkipText = styled.Text`
  color: #a83232;
  font-size: 16px;
  font-weight: bold;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #a83232;
  text-align: center;
  margin: 20px 0;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
