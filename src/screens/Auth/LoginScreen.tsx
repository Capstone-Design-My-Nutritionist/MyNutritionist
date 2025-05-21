import React, {useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import {API_URL} from '../../utils/env';

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    try {
      console.log('📤 로그인 요청:', {email, password});
      console.log('🌐 API_URL:', API_URL);

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log('✅ 로그인 응답:', response.data);

      const token = response.headers['authorization']?.replace('Bearer ', '');

      if (token) {
        await AsyncStorage.setItem('accessToken', token);
        console.log('🔐 토큰 저장 완료:', token);
        
        // 사용자 정보 저장 (응답에서 가져올 수 있는 정보)
        if (response.data && response.data.nickname) {
          await AsyncStorage.setItem('userNickname', response.data.nickname);
          console.log('👤 닉네임 저장 완료:', response.data.nickname);
        } else {
          // 닉네임이 없는 경우 이메일에서 사용자 이름 추출
          const username = email.split('@')[0];
          await AsyncStorage.setItem('userNickname', username);
          console.log('👤 닉네임 저장 완료 (이메일에서 추출):', username);
        }
        
        setErrorMsg('');
        Alert.alert('로그인 성공', '메인 화면으로 이동합니다.');
        navigation.replace('Main');
      } else {
        console.warn('❗ 응답 헤더에 토큰 없음:', response.headers);
        setErrorMsg('로그인 실패: 토큰이 응답되지 않았습니다.');
      }
    } catch (error: any) {
      console.log('❌ 로그인 에러:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        Alert.alert('로그인 오류', '서버에 접속할 수 없습니다.');
      }
    }
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <Container>
      <LogoWrapper>
        <LogoText>LOGO</LogoText>
      </LogoWrapper>

      <InputLabel>이메일</InputLabel>
      <StyledInput
        placeholder="이메일을 입력해주세요"
        placeholderTextColor="#999"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <InputLabel>비밀번호</InputLabel>
      <StyledInput
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {errorMsg !== '' && <ErrorText>{errorMsg}</ErrorText>}

      <ButtonWrapper>
        <LoginButton onPress={handleLogin}>
          <ButtonText>로그인</ButtonText>
        </LoginButton>

        <SignUpButton onPress={goToSignUp}>
          <SignUpText>회원가입</SignUpText>
        </SignUpButton>
      </ButtonWrapper>
    </Container>
  );
};

export default LoginScreen;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 24px;
  background-color: #fff;
`;

const LogoWrapper = styled.View`
  border: 2px solid #000;
  border-radius: 20px;
  padding: 36px 0;
  align-items: center;
`;

const LogoText = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const InputLabel = styled.Text`
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 12px;
`;

const StyledInput = styled.TextInput`
  border: 1px solid #333;
  border-radius: 12px;
  height: 40px;
  padding: 10px 14px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-top: 6px;
  font-size: 12px;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: #e44f68;
  padding: 12px 24px;
  border-radius: 12px;
  flex: 1;
  margin-right: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const SignUpButton = styled.TouchableOpacity`
  border: 1px solid #e44f68;
  padding: 12px 24px;
  border-radius: 12px;
  flex: 1;
  margin-left: 8px;
  align-items: center;
`;

const SignUpText = styled.Text`
  color: #e44f68;
  font-weight: bold;
`;
