import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface SurveySkipModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const SurveySkipModal: React.FC<SurveySkipModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <ModalBackground>
        <ModalContainer>
          <ModalTitle>알림</ModalTitle>
          <ModalContent>
            지금 스킵하시면 알맞은 영양제를 추천해드릴 수 없어요.{'\n'}
            계속 진행하시겠어요?
          </ModalContent>
          <ButtonContainer>
            <CancelButton onPress={onCancel}>
              <CancelButtonText>취소</CancelButtonText>
            </CancelButton>
            <ConfirmButton onPress={onConfirm}>
              <ConfirmButtonText>나가기</ConfirmButtonText>
            </ConfirmButton>
          </ButtonContainer>
        </ModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default SurveySkipModal;

const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
  margin-bottom: 15px;
`;

const ModalContent = styled.Text`
  font-family: 'Pretendard-Regular';
  font-size: 16px;
  color: #333;
  text-align: center;
  line-height: 24px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  background-color: #E0E0E0;
  border-radius: 5px;
  margin-right: 10px;
  align-items: center;
`;

const CancelButtonText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #333;
`;

const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  background-color: #E44F68;
  border-radius: 5px;
  margin-left: 10px;
  align-items: center;
`;

const ConfirmButtonText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: white;
`;
