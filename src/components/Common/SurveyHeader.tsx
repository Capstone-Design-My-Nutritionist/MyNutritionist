// components/Common/SurveyHeader.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import SurveySkipModal from '../Modal/SurveySkipModal';
import { resetSurveyState } from '../../utils/surveyUtils';

interface SurveyHeaderProps {
  title: string;
  skipTarget?: string; // Skip 버튼 클릭 시 이동할 화면 (선택 사항)
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({ title, skipTarget }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSkipPress = () => {
    if (!skipTarget) return;
    setModalVisible(true);
  };

  const handleSkipConfirm = async () => {
    setModalVisible(false);
    // 설문 상태 초기화
    await resetSurveyState();
    // 메인 화면으로 이동
    // @ts-ignore: 타입 정의 임시 처리
    navigation.navigate('Main');
  };

  return (
    <>
      <Header>
        <HeaderTitleContainer>
          <HeaderTitle>{title}</HeaderTitle>
        </HeaderTitleContainer>
        {skipTarget && (
          <SkipButton onPress={handleSkipPress}>
            <SkipText>skip &gt;</SkipText>
          </SkipButton>
        )}
      </Header>

      {/* 스킵 확인 모달 */}
      <SurveySkipModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleSkipConfirm}
      />
    </>
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
