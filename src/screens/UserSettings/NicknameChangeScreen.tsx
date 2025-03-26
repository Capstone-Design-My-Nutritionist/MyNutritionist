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
    if (duplicateNicknames.includes(nickname.trim())) {
      setError('해당 닉네임은 이미 사용중입니다.');
    } else {
      setError('');
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
    navigation.navigate('ProfileScreen');
  };

  return (
    <>
      <CommonHeader title="닉네임 변경" />

      <Container>
        <LogoBox>
          <LogoText>Logo</LogoText>
        </LogoBox>

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
        onCancel={() => setModalVisible(false)}
        onConfirm={handleSubmit}
        message="닉네임을 변경하시겠습니까?"
        confirmText="변경하기"
        cancelText="취소"
      />
    </>
  );
};

export default NicknameChangeScreen;

const BackText = styled.Text`
  font-size: 20px;
  color: #731a22;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 61px 60px;
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
  margin-bottom: 5px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NicknameInput = styled.TextInput`
  flex: 1;
  height: 30px;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 13px;
  margin-bottom: 4px;
`;

const CheckButton = styled.TouchableOpacity`
  background-color: #d95b72;
  margin-left: 8px;
  padding: 0 8px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 4px;
`;

const CheckText = styled.Text`
  color: #fff;
  font-size: 13px;
  line-height: 20px;
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
  width: 130px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SecondaryButton = styled.TouchableOpacity`
  background-color: white;
  border: 1px solid #d95b72;
  width: 130px;
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
