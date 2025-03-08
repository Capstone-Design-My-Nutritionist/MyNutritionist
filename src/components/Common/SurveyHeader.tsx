// components/Common/SurveyHeader.tsx
import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

interface SurveyHeaderProps {
  title: string;
  skipTarget?: string; // Skip 버튼 클릭 시 이동할 화면 (선택 사항)
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({title, skipTarget}) => {
  const navigation = useNavigation();

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
