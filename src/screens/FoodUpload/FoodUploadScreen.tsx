import React, {useState} from 'react';
import {Modal, Image, Platform} from 'react-native';
import styled from 'styled-components/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CommonHeader from '../../components/Common/CommonHeader';

const FoodUploadScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null);
      }
      closeModal();
    });
  };

  const handleCamera = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null);
      }
      closeModal();
    });
  };

  return (
    <Container>
      <CommonHeader title="음식 사진 업로드" />

      <Content>
        <DateTitle>오늘의 날짜</DateTitle>
        <DateText>2025년 1월 5일</DateText>

        <UploadBox onPress={openModal}>
          {imageUri ? (
            <UploadedImage source={{uri: imageUri}} />
          ) : (
            <>
              <UploadIcon>📤</UploadIcon>
              <UploadText>이미지를 업로드 해주세요</UploadText>
            </>
          )}
        </UploadBox>

        <SubmitButton>
          <SubmitText>제출하기</SubmitText>
        </SubmitButton>
      </Content>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        statusBarTranslucent>
        <Backdrop>
          <ModalContainer activeOpacity={1}>
            <OptionBox onPress={handleImagePick}>
              <OptionRow>
                <OptionText>앨범에서 가져오기</OptionText>
                <OptionIcon>📷</OptionIcon>
              </OptionRow>
            </OptionBox>

            <OptionBox onPress={handleCamera}>
              <OptionRow>
                <OptionText>직접 찍어 올리기</OptionText>
                <OptionIcon>🖼️</OptionIcon>
              </OptionRow>
            </OptionBox>
          </ModalContainer>

          <CancelButton onPress={closeModal}>
            <CancelText>취소</CancelText>
          </CancelButton>
        </Backdrop>
      </Modal>
    </Container>
  );
};

export default FoodUploadScreen;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Content = styled.View`
  flex: 1;
  padding: 65px;
  align-items: center;
`;

const DateTitle = styled.Text`
  font-size: 20px;
  font-family: 'Pretendard-Bold';
  color: #000;
  margin-bottom: 13px;
`;

const DateText = styled.Text`
  font-size: 16px;
  color: #000;
  margin-bottom: 81px;
`;

const UploadBox = styled.TouchableOpacity`
  width: 281px;
  height: 194px;
  border-width: 2px;
  border-color: #ff8080;
  border-style: dashed;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 195px;
`;

const UploadIcon = styled.Text`
  font-size: 24px;
  margin-bottom: 32px;
`;

const UploadText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: #000;
`;

const UploadedImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 320px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const SubmitText = styled.Text`
  color: white;
  font-size: 14px;
`;

const Backdrop = styled.View`
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
`;

const ModalContainer = styled.TouchableOpacity`
  width: 320px;
  justify-content: center;
  gap: 20px;
`;

const OptionBox = styled.TouchableOpacity`
  background-color: white;
  height: 120px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
`;

const OptionRow = styled.View`
  width: 70%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OptionText = styled.Text`
  font-size: 22px;
  font-family: 'Pretendard-Bold';
  color: #000;
`;

const OptionIcon = styled.Text`
  font-size: 38px;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 320px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  position: absolute;
  bottom: 220px;
`;

const CancelText = styled.Text`
  color: white;
  font-size: 14px;
  font-family: 'Pretendard';
`;
