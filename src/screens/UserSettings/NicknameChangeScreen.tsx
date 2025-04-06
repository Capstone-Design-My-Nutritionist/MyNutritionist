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

const NicknameChangeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // 예시: 중복 닉네임 리스트
  const duplicateNicknames = ['홍길동', 'admin'];

  const handleCheckDuplicate = () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    
    if (duplicateNicknames.includes(nickname.trim())) {
      setError('해당 닉네임은 이미 사용중입니다.');
    } else {
      setError('사용 가능한 닉네임입니다.');
      // 실제로는 서버에 중복 확인 API 호출해야 함
    }
  };

  const handleConfirm = () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (duplicateNicknames.includes(nickname.trim())) {
      setError('해당 닉네임은 이미 사용중입니다.');
      return;
    }

    setError('');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    setModalVisible(false);
    console.log('닉네임 변경 완료');
    // 닉네임 변경 API 호출 등의 로직 추가
    
    // 변경 완료 후 ProfileScreen으로 이동
    navigation.navigate('ProfileScreen');
  };

  return (
    <>
      <CommonHeader title="닉네임 변경" />
      <Container>
        <Form>
          <Label>새 닉네임</Label>
          <InputRow>
            <NicknameInput
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChangeText={setNickname}
            />
            <Shadow
              distance={4}
              offset={[0, 2]}
              startColor="rgba(0, 0, 0, 0.05)"
              style={{borderRadius: 8}}>
              <CheckButton onPress={handleCheckDuplicate}>
                <CheckText>중복확인</CheckText>
              </CheckButton>
            </Shadow>
          </InputRow>

          {error ? <ErrorText style={{color: error.includes('사용 가능') ? '#4CAF50' : '#e44f68'}}>{error}</ErrorText> : null}

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
        message="닉네임을 변경하시겠습니까?"
        confirmText="변경"
        cancelText="취소"
        onConfirm={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default NicknameChangeScreen;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const Form = styled.View`
  width: 100%;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #070c26;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const NicknameInput = styled.TextInput`
  flex: 1;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  margin-right: 8px;
`;

const CheckButton = styled.TouchableOpacity`
  background-color: #e44f68;
  padding: 0 16px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const CheckText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  font-size: 14px;
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
