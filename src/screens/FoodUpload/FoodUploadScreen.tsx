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

      <Modal transparent visible={modalVisible} animationType="fade">
        <Backdrop onPress={closeModal}>
          <ModalContent>
            <OptionButton onPress={handleImagePick}>
              <OptionText>앨범에서 가져오기 📷</OptionText>
            </OptionButton>
            <OptionButton onPress={handleCamera}>
              <OptionText>직접 찍어 올리기 📸</OptionText>
            </OptionButton>
            <CancelButton onPress={closeModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ModalContent>
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

const Header = styled.View`
  padding-top: 11px;
  padding-bottom: 6px;
  background-color: #fff;
  border-bottom-width: 1.3px;
  border-color: #731a22;
  align-items: center;
  position: relative;
`;

const BackText = styled.Text`
  position: absolute;
  left: 20px;
  font-size: 20px;
  color: #731a22;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-family: 'Pretendard-Bold';
  color: #731a22;
`;

const Content = styled.View`
  flex: 1;
  padding: 40px 20px;
  align-items: center;
`;

const DateTitle = styled.Text`
  font-size: 16px;
  font-family: 'Pretendard-Bold';
  color: #000;
  margin-bottom: 4px;
`;

const DateText = styled.Text`
  font-size: 14px;
  color: #000;
  margin-bottom: 24px;
`;

const UploadBox = styled.TouchableOpacity`
  width: 280px;
  height: 180px;
  border-width: 1.5px;
  border-color: #ff8080;
  border-style: dashed;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const UploadIcon = styled.Text`
  font-size: 24px;
  margin-bottom: 8px;
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
  padding: 10px 40px;
  border-radius: 8px;
`;

const SubmitText = styled.Text`
  color: white;
  font-size: 14px;
`;

const Backdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 260px;
  background-color: #fff;
  padding: 18px;
  border-radius: 12px;
  gap: 12px;
`;

const OptionButton = styled.TouchableOpacity`
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
`;

const OptionText = styled.Text`
  font-size: 14px;
  text-align: center;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #d95b72;
  padding: 10px;
  border-radius: 8px;
`;

const CancelText = styled.Text`
  color: white;
  font-size: 14px;
  text-align: center;
`;
