import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  message,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Backdrop>
        <ModalContainer>
          <Message>{message}</Message>
          <ButtonRow>
            <PrimaryButton onPress={onConfirm}>
              <PrimaryText>{confirmText}</PrimaryText>
            </PrimaryButton>
            <SecondaryButton onPress={onCancel}>
              <SecondaryText>{cancelText}</SecondaryText>
            </SecondaryButton>
          </ButtonRow>
        </ModalContainer>
      </Backdrop>
    </Modal>
  );
};

export default ConfirmModal;

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 280px;
  height: 160px;
  padding: 22px;
  background-color: white;
  border-radius: 12px;
  align-items: center;
  justify-content: space-evenly;
`;

const Message = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Regular';
  color: #070c26;
  margin-bottom: 10px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 80px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SecondaryButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  width: 80px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const PrimaryText = styled.Text`
  color: #ffffff;
  font-size: 12px;
`;

const SecondaryText = styled.Text`
  color: #d95b72;
  font-size: 12px;
`;
