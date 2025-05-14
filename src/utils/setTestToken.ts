import AsyncStorage from '@react-native-async-storage/async-storage';

export const setTestAccessToken = async () => {
  const token =
    'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnaXN1MTEwMkBnbWFpbC5jb20iLCJhdXRoIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzQ0Nzk5NjA2LCJleHAiOjE3NDQ4MDE0MDZ9.ImjYDLka9LlxXbzrv0DU4Eo_mvQQWqYl5l9SSsvNe2GzlNMNue5hfLaACtjYB2ai4iBPnYRkpd04xjs2eIBI3g ';
  try {
    await AsyncStorage.setItem('accessToken', token);
    console.log('✅ 테스트용 accessToken 저장 완료');
  } catch (error) {
    console.error('❌ 토큰 저장 실패:', error);
  }
};
