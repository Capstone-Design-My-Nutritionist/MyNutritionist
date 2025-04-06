import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Shadow} from 'react-native-shadow-2';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import CommonHeader from '../../components/Common/CommonHeader';

type RootStackParamList = {
  ProfileScreen: undefined;
};

const AccountDeleteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    if (confirmationText.trim() !== '회원을 탈퇴하겠습니다') {
      setError(`"회원을 탈퇴하겠습니다"를 정확히 입력해주세요.`);
      return;
    }

    setError('');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    setModalVisible(false);
    console.log('회원 탈퇴 완료');
    // 회원 탈퇴 API 호출 등의 로직 추가
    
    // 탈퇴 완료 후 ProfileScreen으로 이동
    navigation.navigate('ProfileScreen');
  };

  return (
    <>
      <CommonHeader title="회원탈퇴" />
      <Container>
        <WarningContainer>
          <WarningTitle>정말로 떠나시겠습니까?</WarningTitle>
          <WarningText>
            회원 탈퇴 시 모든 개인정보와 설문조사 결과가 삭제됩니다.
            이 작업은 되돌릴 수 없습니다.
          </WarningText>
          <WarningInstructions>
            * 아래에 "회원을 탈퇴하겠습니다"를 입력해주세요.
          </WarningInstructions>
          
          <InputField
            placeholder="회원을 탈퇴하겠습니다"
            value={confirmationText}
            onChangeText={setConfirmationText}
            underlineColorAndroid="transparent"
          />
          {error ? <ErrorText>{error}</ErrorText> : null}

          <ButtonContainer>
            <Shadow
              distance={4}
              offset={[0, 2]}
              startColor="rgba(0, 0, 0, 0.05)"
              style={{width: '100%', borderRadius: 8, marginTop: 20}}>
              <DeleteButton onPress={handleConfirm}>
                <DeleteButtonText>탈퇴하기</DeleteButtonText>
              </DeleteButton>
            </Shadow>
            
            <CancelButton onPress={() => navigation.goBack()}>
              <CancelButtonText>취소하고 돌아가기</CancelButtonText>
            </CancelButton>
          </ButtonContainer>
        </WarningContainer>
      </Container>

      <ConfirmModal
        visible={modalVisible}
        message="정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default AccountDeleteScreen;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const WarningContainer = styled.View`
  width: 100%;
  padding: 20px;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  background-color: #fff9f9;
`;

const WarningTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #e44f68;
  margin-bottom: 16px;
  text-align: center;
`;

const WarningText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  line-height: 24px;
  text-align: center;
`;

const WarningInstructions = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #e44f68;
  margin-bottom: 12px;
`;

const InputField = styled.TextInput`
  width: 100%;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #e44f68;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  align-items: center;
`;

const DeleteButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #e44f68;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const DeleteButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

const CancelButton = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 8px;
`;

const CancelButtonText = styled.Text`
  font-size: 16px;
  color: #666;
  text-decoration: underline;
`;
