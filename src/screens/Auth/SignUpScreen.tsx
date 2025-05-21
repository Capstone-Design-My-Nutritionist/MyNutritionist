import React, {useState} from 'react';
import {Alert, Image} from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import {API_URL} from '../../utils/env';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [nicknameValid, setNicknameValid] = useState<null | boolean>(null);
  const [emailValid, setEmailValid] = useState<null | boolean>(null);
  const [pwMatch, setPwMatch] = useState<null | boolean>(null);

  const checkNickname = async () => {
    try {
      const res = await axios.get(
        `https://your-api.com/check-nickname?nickname=${nickname}`,
      );
      setNicknameValid(res.data.available);
    } catch {
      Alert.alert('오류', '닉네임 중복 확인 실패');
    }
  };

  const checkEmail = async () => {
    try {
      const res = await axios.get(
        `https://your-api.com/check-email?email=${email}`,
      );
      setEmailValid(res.data.available);
    } catch {
      Alert.alert('오류', '이메일 중복 확인 실패');
    }
  };

  const handleSignUp = async () => {
    if (!name || !nickname || !email || !password || !confirmPw) {
      Alert.alert('입력 오류', '모든 항목을 입력해 주세요.');
      return;
    }

    if (password !== confirmPw) {
      setPwMatch(false);
      return;
    }

    console.log('📤 보낸 회원가입 데이터:', {email, password, nickname});

    try {
      // 1. 회원가입 요청
      const signupRes = await axios.post(`${API_URL}/users/signup`, {
        email,
        password,
        nickname,
      });

      console.log('✅ 회원가입 응답:', signupRes.data);

      if (signupRes.data?.success === true) {
        console.log('✅ 회원가입 성공 → 로그인 시도');

        // 2. 로그인 요청
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        console.log('✅ 로그인 응답:', loginRes.data);

        // 로그인 응답에서 success만 확인하고 토큰 저장은 생략
        if (loginRes.data?.success === true) {
          Alert.alert('회원가입 완료', '로그인 화면으로 이동합니다.');
          navigation.replace('Login'); // 또는 replace('Main') 도 가능
        } else {
          Alert.alert('로그인 실패', '로그인 중 문제가 발생했습니다.');
        }
      } else {
        Alert.alert(
          '회원가입 실패',
          signupRes.data?.message ?? '회원가입에 실패했습니다.',
        );
      }
    } catch (err: any) {
      console.log('❌ 에러:', err.response?.data || err.message);

      if (err.response?.status === 409) {
        Alert.alert('회원가입 실패', '이미 존재하는 이메일 또는 닉네임입니다.');
      } else {
        Alert.alert('회원가입 실패', '알 수 없는 오류가 발생했습니다.');
      }
    }
  };
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Container>
      <LogoBox>
        <Image
          source={require('../../assets/logo/Fooding_Logo.png')}
          style={{width: 200, height: 200, resizeMode: 'contain'}}
        />
      </LogoBox>

      <Label>이름</Label>
      <Input
        placeholder="이름을 입력해주세요."
        value={name}
        onChangeText={setName}
      />

      <Row>
        <Input
          style={{flex: 1}}
          placeholder="사용하실 닉네임을 입력해주세요."
          value={nickname}
          onChangeText={setNickname}
        />
        <CheckButton onPress={checkNickname}>
          <CheckText>중복확인</CheckText>
        </CheckButton>
      </Row>
      {nicknameValid === false && (
        <ErrorText>❗ 해당 닉네임은 이미 사용중입니다.</ErrorText>
      )}
      {nicknameValid === true && (
        <SuccessText>✅ 해당 닉네임은 사용 가능합니다.</SuccessText>
      )}

      <Row>
        <Input
          style={{flex: 1}}
          placeholder="이메일을 입력해주세요."
          value={email}
          onChangeText={setEmail}
        />
        <CheckButton onPress={checkEmail}>
          <CheckText>중복확인</CheckText>
        </CheckButton>
      </Row>
      {emailValid === false && (
        <ErrorText>❗ 해당 이메일은 이미 사용중입니다.</ErrorText>
      )}
      {emailValid === true && (
        <SuccessText>✅ 해당 이메일은 사용 가능합니다.</SuccessText>
      )}

      <Label>비밀번호</Label>
      <Input
        placeholder="비밀번호는 8~16자 이내로 입력해주세요"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Label>비밀번호 확인</Label>
      <Input
        placeholder="비밀번호를 다시 한 번 입력해주세요."
        secureTextEntry
        value={confirmPw}
        onChangeText={(text: string) => {
          setConfirmPw(text);
          setPwMatch(text === password);
        }}
      />
      {pwMatch === false && (
        <ErrorText>❗ 입력된 비밀번호와 일치하지 않습니다.</ErrorText>
      )}
      {pwMatch === true && (
        <SuccessText>✅ 비밀번호 확인이 일치합니다.</SuccessText>
      )}

      <ButtonRow>
        <SubmitButton onPress={handleSignUp}>
          <SubmitText>회원가입</SubmitText>
        </SubmitButton>
        <CancelButton onPress={() => navigation.navigate('Login')}>
          <CancelText>취소</CancelText>
        </CancelButton>
      </ButtonRow>
    </Container>
  );
};

export default SignUpScreen;

const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding: 24px;
`;

const LogoBox = styled.View`
  padding: 36px;
  align-items: center;
  margin-bottom: 36px;
`;

const LogoText = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const Label = styled.Text`
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 16px;
`;

const Input = styled.TextInput`
  border: 1px solid #000;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 6px;
  height: 40px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const CheckButton = styled.TouchableOpacity`
  background-color: #e44f68;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-left: 8px;
  width: 60px;
  height: 40px;
`;

const CheckText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 12px;
  margin-bottom: 6px;
`;

const SuccessText = styled.Text`
  color: green;
  font-size: 12px;
  margin-bottom: 6px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #e44f68;
  padding: 14px 24px;
  border-radius: 12px;
  flex: 1;
  margin-right: 8px;
  align-items: center;
`;

const SubmitText = styled.Text`
  color: white;
  font-weight: bold;
`;

const CancelButton = styled.TouchableOpacity`
  border: 1px solid #e44f68;
  padding: 14px 24px;
  border-radius: 12px;
  flex: 1;
  margin-left: 8px;
  align-items: center;
`;

const CancelText = styled.Text`
  color: #e44f68;
  font-weight: bold;
`;
