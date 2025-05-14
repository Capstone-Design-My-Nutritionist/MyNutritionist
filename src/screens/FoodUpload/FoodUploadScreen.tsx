import React, {useState, useEffect} from 'react';
import {Modal, Image, Platform, Alert, ActivityIndicator, PermissionsAndroid} from 'react-native';
import styled from 'styled-components/native';
import {launchCamera, launchImageLibrary, CameraOptions} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodUploadStackParamList} from '../../navigation/types';
import CommonHeader from '../../components/Common/CommonHeader';
import {predictImage} from '../../native_modules/FoodLensModule';

const FoodUploadScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<FoodUploadStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  
  // 현재 날짜를 포맷팅하여 설정
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
    const day = now.getDate();
    
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  }, []);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null);
      }
      closeModal();
    });
  };

  // 카메라 권한 요청 함수
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "카메라 권한 요청",
            message: "음식 사진을 찍기 위해 카메라 권한이 필요합니다.",
            buttonNeutral: "나중에 묻기",
            buttonNegative: "취소",
            buttonPositive: "확인"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('권한 거부됨', '카메라 권한이 거부되었습니다.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS는 항상 true 반환
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      closeModal();
      return;
    }
    
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true, // 촬영한 사진을 갤러리에 저장
      includeBase64: false,
      cameraType: 'back'
    };
    
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 카메라를 취소했습니다');
      } else if (response.errorCode) {
        console.error('카메라 오류:', response.errorMessage);
        Alert.alert('카메라 오류', response.errorMessage || '카메라를 실행하는 중 오류가 발생했습니다.');
      } else if (response.assets && response.assets[0]) {
        console.log('카메라로 촬영한 이미지:', response.assets[0].uri);
        setImageUri(response.assets[0].uri ?? null);
      }
      closeModal();
    });
  };
  
  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('알림', '이미지를 먼저 업로드해주세요.');
      return;
    }
    
    console.log('📷 imageUri before predictImage:', imageUri);

    try {
      setLoading(true);
      const result = await predictImage(imageUri);
      setLoading(false);
      
      // FoodLens로부터 받은 데이터를 JSON 형식으로 콘솔에 출력
      console.log('FoodLens 분석 결과 (JSON):', JSON.stringify(result, null, 2));
      
      // 각 음식 항목별 상세 정보 출력
      if (result?.foods && result.foods.length > 0) {
        console.log(`총 ${result.foods.length}개의 음식이 인식되었습니다:`);
        result.foods.forEach((food, index) => {
          console.log(`음식 ${index + 1}: ${food.name}`);
          console.log(`영양 정보:`, JSON.stringify(food.nutritionInfo, null, 2));
        });
      }
      
      // 결과 화면으로 이동 - 중첩 네비게이터 내부에서 이동
      navigation.navigate('FoodUploadResultScreen', { result, imageUri });
    } catch (error) {
      setLoading(false);
      Alert.alert(
        '분석 실패', 
        '음식 이미지 분석에 실패했습니다. 다시 시도해주세요.'
      );
      console.error('FoodLens 분석 오류:', error);
    }
  };

  return (
    <Container>
      <CommonHeader title="음식 사진 업로드" />

      <Content>
        <DateTitle>오늘의 날짜</DateTitle>
        <DateText>{currentDate}</DateText>

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

        <SubmitButton onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <SubmitText>제출하기</SubmitText>
          )}
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
  margin-bottom: 100px;
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
