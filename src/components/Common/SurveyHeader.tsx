// components/Common/SurveyHeader.tsx
import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

interface SurveyHeaderProps {
  title: string;
  skipTarget?: string; // Skip 버튼 클릭 시 이동할 화면 (선택 사항)
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({title, skipTarget}) => {
  const navigation = useNavigation();

  const handleSkipPress = () => {
    if (!skipTarget) return;

    Alert.alert(
      '지금 skip을 하시면, 알맞은 영양제를 추천해드릴 수 없어요.',
      '(나중에 다시 참여 가능하나, 처음부터 진행하셔야 합니다.)',
      [
        {
          text: '나가기',
          // onPress: () => navigation.navigate(skipTarget),
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <Header>
      <HeaderTitleContainer>
        <HeaderTitle>{title}</HeaderTitle>
      </HeaderTitleContainer>
      {skipTarget && (
        <SkipButton>
          {/* onPress={() => navigation.navigate(skipTarget)} */}
          <SkipText>skip &gt;</SkipText>
        </SkipButton>
      )}
    </Header>
  );
};

export default SurveyHeader;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 51px;
  margin-bottom: 17px;
`;

const HeaderTitleContainer = styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  width: 100%;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #731a22;
  text-align: center;
`;

const SkipButton = styled.TouchableOpacity`
  z-index: 1;
  margin-left: auto;
`;

const SkipText = styled.Text`
  color: #731a22;
  font-size: 16px;
  font-weight: bold;
`;
