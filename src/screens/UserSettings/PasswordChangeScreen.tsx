import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Shadow} from 'react-native-shadow-2';
import ConfirmModal from '../../components/Modal/ConfirmModal'; // 모달 컴포넌트 경로에 맞게 수정
import CommonHeader from '../../components/Common/CommonHeader';

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
    // 비밀번호 변경 API 호출 등의 로직 추가
    
    // 변경 완료 후 ProfileScreen으로 이동
    navigation.navigate('ProfileScreen');
  };

  return (
    <>
      <CommonHeader title="비밀번호 변경" />
      <Container>
        <Form>
          <InputGroup>
            <Label>새 비밀번호</Label>
            <Input
              placeholder="새 비밀번호를 입력해주세요"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </InputGroup>
          <InputGroup>
            <Label>새 비밀번호 확인</Label>
            <Input
              placeholder="새 비밀번호를 다시 입력해주세요"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </InputGroup>
          {error ? <ErrorText>{error}</ErrorText> : null}
          <Shadow
            distance={4}
            offset={[0, 2]}
            startColor="rgba(0, 0, 0, 0.05)"
            style={{width: '100%', borderRadius: 8, marginTop: 20}}>
            <ConfirmButton onPress={handleConfirm}>
              <ConfirmText>변경하기</ConfirmText>
            </ConfirmButton>
          </Shadow>
        </Form>
      </Container>

      <ConfirmModal
        visible={modalVisible}
        message="비밀번호를 변경하시겠습니까?"
        confirmText="변경"
        cancelText="취소"
        onConfirm={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default PasswordChangeScreen;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const Form = styled.View`
  width: 100%;
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #070c26;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #e44f68;
  margin-bottom: 16px;
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
