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
      setError(`잘못된 입력입니다.`);
      return;
    }

    setError('');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    setModalVisible(false);
    console.log('회원 탈퇴 완료');
    navigation.navigate('ProfileScreen');
  };

  return (
    <>
      <CommonHeader title="회원탈퇴" />

      <Container>
        <LogoBox>
          <LogoText>Logo</LogoText>
        </LogoBox>

        <Form>
          <WarningTitle>정말로 떠나시겠습니까?</WarningTitle>
          <WarningText>* "회원을 탈퇴하겠습니다"를 입력해주세요.</WarningText>
          <InputField
            placeholder="떠나지 마요 ㅠㅠ..."
            value={confirmationText}
            onChangeText={setConfirmationText}
            underlineColorAndroid="transparent"
          />
          {error ? <ErrorText>{error}</ErrorText> : null}

          <ButtonRow>
            <Shadow
              distance={4}
              offset={[0, 2]}
              startColor="rgba(0, 0, 0, 0.05)"
              style={{borderRadius: 8}}>
              <PrimaryButton onPress={handleConfirm}>
                <ButtonText>탈퇴하기</ButtonText>
              </PrimaryButton>
            </Shadow>
            <Shadow
              distance={4}
              offset={[0, 2]}
              startColor="rgba(0, 0, 0, 0.05)"
              style={{borderRadius: 8}}>
              <SecondaryButton onPress={() => navigation.goBack()}>
                <CancelText>취소</CancelText>
              </SecondaryButton>
            </Shadow>
          </ButtonRow>
        </Form>
      </Container>

      <ConfirmModal
        visible={modalVisible}
        message="정말로 탈퇴하시겠습니까?"
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default AccountDeleteScreen;

const TitleWrapper = styled.View`
  background-color: #ffffff;
  padding-top: 11px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #731a22;
  text-align: center;
  margin-bottom: 11px;
`;

const TitleUnderline = styled.View`
  width: 100%;
  height: 1.3px;
  background-color: #731a22;
  margin-bottom: 6px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;

const BackText = styled.Text`
  font-size: 20px;
  color: #731a22;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 61px 90px;
`;

const LogoBox = styled.View`
  width: 160px;
  height: 40px;
  border: 1px solid #000;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: 40px;
`;

const LogoText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: black;
`;

const Form = styled.View``;

const WarningTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 15px;
  color: #000000;
  text-align: center;
  margin-bottom: 4px;
`;

const WarningText = styled.Text`
  font-size: 10px;
  color: #ff0707;
  text-align: center;
  margin-bottom: 8px;
`;

const InputField = styled.TextInput`
  height: 30px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 13px;
  margin-bottom: 4px;
`;

const ErrorText = styled.Text`
  font-size: 10px;
  color: #ff0707;
  margin-bottom: 5px;
  text-align: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 100px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SecondaryButton = styled.TouchableOpacity`
  background-color: white;
  border: 1px solid #d95b72;
  width: 100px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 13px;
  line-height: 20px;
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 13px;
  line-height: 20px;
`;
