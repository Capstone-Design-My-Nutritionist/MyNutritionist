import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Shadow} from 'react-native-shadow-2'; // 상단 import 추가
import CommonHeader from '../../components/Common/CommonHeader';

type RootStackParamList = {
  ProfileScreen: undefined;
  PasswordVerifyScreen: {
    nextScreen:
      | 'PasswordChangeScreen'
      | 'NicknameChangeScreen'
      | 'AccountDeleteScreen';
    title: string;
  };
  PasswordChangeScreen: undefined;
  NicknameChangeScreen: undefined;
  AccountDeleteScreen: undefined;
};

type PasswordVerifyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PasswordVerifyScreen'
>;

type PasswordVerifyScreenRouteProp = RouteProp<
  RootStackParamList,
  'PasswordVerifyScreen'
>;

const PasswordVerifyScreen = () => {
  const navigation = useNavigation<PasswordVerifyScreenNavigationProp>();
  const route = useRoute<PasswordVerifyScreenRouteProp>();
  const {nextScreen, title} = route.params;

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    // 여기서 실제로는 비밀번호 검증 로직이 들어가야 함
    // 예시로 비밀번호가 '1234'라고 가정
    if (password === '1234') {
      setError('');
      
      // 다음 화면으로 이동
      navigation.navigate(nextScreen);
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <>
      <CommonHeader title={title} />
      <Container>
        <LogoBox>
          <LogoText>Logo</LogoText>
        </LogoBox>

        <Form>
          <Label>비밀번호 확인</Label>
          <InputRow>
            <PasswordInput
              placeholder="기존 비밀번호를 입력해주세요"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Shadow
              distance={4}
              offset={[7, 2]}
              startColor="rgba(0, 0, 0, 0.05)"
              style={{width: '100%', borderRadius: 8}}>
              <ConfirmButton onPress={handleConfirm}>
                <ConfirmText>확인</ConfirmText>
              </ConfirmButton>
            </Shadow>
          </InputRow>
          {error ? <ErrorText>{error}</ErrorText> : null}
        </Form>
      </Container>
    </>
  );
};

export default PasswordVerifyScreen;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 55px;
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

const Form = styled.View`
  width: 100%;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #070c26;
`;

const InputRow = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const PasswordInput = styled.TextInput`
  width: 100%;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 16px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const ConfirmButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #e44f68;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const ConfirmText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #e44f68;
  margin-top: -8px;
  margin-bottom: 16px;
`;
