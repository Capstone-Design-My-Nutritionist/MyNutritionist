import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Shadow} from 'react-native-shadow-2'; // 상단 import 추가

type RootStackParamList = {
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

type Props = {
  route: RouteProp<RootStackParamList, 'PasswordVerifyScreen'>;
};

const PasswordVerifyScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, 'PasswordVerifyScreen'>>();
  const {nextScreen} = route.params;

  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (!password.trim()) return;

    if (nextScreen === 'PasswordChangeScreen') {
      navigation.navigate('PasswordChangeScreen');
    } else if (nextScreen === 'NicknameChangeScreen') {
      navigation.navigate('NicknameChangeScreen');
    } else if (nextScreen === 'AccountDeleteScreen') {
      navigation.navigate('AccountDeleteScreen');
    }
  };

  return (
    <>
      <TitleWrapper>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>{'<'}</BackText>
        </BackButton>
        <Title>{route.params.title}</Title>
        <TitleUnderline />
      </TitleWrapper>
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
        </Form>
      </Container>
    </>
  );
};

export default PasswordVerifyScreen;

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
  gap: 10px;
`;

const Label = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: black;
  margin-bottom: 5px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PasswordInput = styled.TextInput`
  flex: 1;
  height: 30px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 13px;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #d95b72;
  margin-left: 8px;
  padding: 0 12px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const ConfirmText = styled.Text`
  color: #fff;
  font-size: 13px;
  line-height: 20px;
`;
