import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Shadow} from 'react-native-shadow-2';
import ConfirmModal from '../../components/Modal/ConfirmModal'; // 모달 컴포넌트 경로에 맞게 수정

type RootStackParamList = {
  ProfileScreen: undefined;
};

const PasswordChangeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError('비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    setModalVisible(false);
    console.log('비밀번호 변경 완료');
    navigation.navigate('ProfileScreen');
  };

  return (
    <>
      <TitleWrapper>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>{'<'}</BackText>
        </BackButton>
        <Title>비밀번호 변경</Title>
        <TitleUnderline />
      </TitleWrapper>

      <Container>
        <LogoBox>
          <LogoText>Logo</LogoText>
        </LogoBox>

        <Form>
          <Label>새 비밀번호</Label>
          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="새 비밀번호를 입력해주세요."
            secureTextEntry
          />
          <InputField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="다시 한 번 더 입력해주세요."
            secureTextEntry
          />

          {error ? <ErrorText>{error}</ErrorText> : null}

          <ButtonRow>
            <Shadow
              distance={4}
              offset={[0, 2]}
              startColor="rgba(0, 0, 0, 0.05)"
              style={{borderRadius: 8}}>
              <PrimaryButton onPress={handleConfirm}>
                <ButtonText>확인</ButtonText>
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
        message="비밀번호를 변경하시겠습니까?"
        confirmText="변경하기"
        cancelText="취소"
        onConfirm={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default PasswordChangeScreen;

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
  color: #731a22;
  font-size: 20px;
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

const Label = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: black;
  margin-bottom: 4px;
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
const ButtonText = styled.Text`
  color: #fff;
  font-size: 13px;
  line-height: 20px;
`;

const SecondaryButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  background-color: white;
  width: 100px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 13px;
  line-height: 20px;
`;
