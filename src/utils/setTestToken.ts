import AsyncStorage from '@react-native-async-storage/async-storage';

export const setTestAccessToken = async () => {
  const token =
    'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnaXN1MTEwMkBnbWFpbC5jb20iLCJhdXRoIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzQ0NzgwMzM0LCJleHAiOjE3NDQ3ODIxMzR9.u7lVVvAadK5GQeWsBcYliV4oomZ4MHrnDqIzY8aEu6OTKFxzXcQYktVBJHeD_kNu4Hz-hAgBStRNVJKbVRaSmQ';
  try {
    await AsyncStorage.setItem('accessToken', token);
    console.log('✅ 테스트용 accessToken 저장 완료');
  } catch (error) {
    console.error('❌ 토큰 저장 실패:', error);
  }
};
