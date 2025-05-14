import React, {useEffect} from 'react';
// import {setTestAccessToken} from './src/utils/setTestToken';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Navigation from './src/navigation/Navigation';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import NutritionDetails from './src/screens/Main/NutritionDetailsScreen';
import FoodRecommendation from './src/screens/Main/FoodRecommendationScreen';
import SupplementDetails from './src/screens/Supplement/SupplementDetailsScreen';
import MealRecords from './src/screens/Main/MealRecordsScreen';
import MealDetails from './src/screens/Calendar/MealDetailsScreen';
import FoodUploadNavigator from './src/navigation/FoodUploadNavigator';
import ProfileScreen from './src/screens/UserSettings/ProfileScreen';
import PasswordVerifyScreen from './src/screens/UserSettings/PasswordVerifyScreen';
import PasswordChangeScreen from './src/screens/UserSettings/PasswordChangeScreen';
import NicknameChangeScreen from './src/screens/UserSettings/NicknameChangeScreen';
import AccountDeleteScreen from './src/screens/UserSettings/AccountDeleteScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Survey Screens
import SurveyGenderScreen from './src/screens/Survey/SurveyGenderScreen';
import SurveyAgeScreen from './src/screens/Survey/SurveyAgeScreen';
import SurveyHeightScreen from './src/screens/Survey/SurveyHeightScreen';
import SurveyWeightScreen from './src/screens/Survey/SurveyWeightScreen';
import SurveyHealthGoalsScreen from './src/screens/Survey/SurveyHealthGoalsScreen';
import SurveyHealthConcernsScreen from './src/screens/Survey/SurveyHealthConcernsScreen';
import SurveyAllergyScreen from './src/screens/Survey/SurveyAllergyScreen';
import SurveyAllergyOkScreen from './src/screens/Survey/SurveyAllergyOkScreen';
import SurveyDiseaseScreen from './src/screens/Survey/SurveyDiseaseScreen';
import SurveyDiseaseOkScreen from './src/screens/Survey/SurveyDiseaseOkScreen';
import SurveyFamilyHistoryScreen from './src/screens/Survey/SurveyFamilyHistoryScreen';
import SurveyFamilyHistoryOkScreen from './src/screens/Survey/SurveyFamilyHistoryOkScreen';
import SurveyMedicationScreen from './src/screens/Survey/SurveyMedicationScreen';
import SurveyMedicationOkScreen from './src/screens/Survey/SurveyMedicationOkScreen';
import SurveySupplementScreen from './src/screens/Survey/SurveySupplementScreen';
import SurveySupplementOkScreen from './src/screens/Survey/SurveySupplementOkScreen';
import SurveyExerciseScreen from './src/screens/Survey/SurveyExerciseScreen';
import SurveySleepTimeScreen from './src/screens/Survey/SurveySleepTimeScreen';
import SurveyMealScreen from './src/screens/Survey/SurveyMealScreen';
import SurveyVegetableScreen from './src/screens/Survey/SurveyVegetableScreen';
import SurveyWaterScreen from './src/screens/Survey/SurveyWaterScreen';
import SurveySmokingScreen from './src/screens/Survey/SurveySmokingScreen';
import SurveyDrinkScreen from './src/screens/Survey/SurveyDrinkScreen';

const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen
        name="PasswordVerifyScreen"
        component={PasswordVerifyScreen}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="PasswordChangeScreen"
        component={PasswordChangeScreen}
      />
      <ProfileStack.Screen
        name="NicknameChangeScreen"
        component={NicknameChangeScreen}
      />
      <ProfileStack.Screen
        name="AccountDeleteScreen"
        component={AccountDeleteScreen}
      />
    </ProfileStack.Navigator>
  );
};

const App = () => {
  // 네비게이션 참조 생성
  const navigationRef = React.useRef(null);

  useEffect(() => {
    // 앱 시작 시 저장된 토큰 확인
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          console.log('✅ 저장된 토큰 발견:', token.substring(0, 20) + '...');
          // 토큰이 있으면 메인 화면으로 자동 이동
          // 네비게이션 참조가 준비된 후에 실행
          setTimeout(() => {
            if (navigationRef.current) {
              // @ts-ignore - 타입 에러 무시
              navigationRef.current.reset({
                index: 0,
                routes: [{ name: 'Main' }]
              });
            }
          }, 100);
        } else {
          console.log('❌ 저장된 토큰 없음, 로그인 화면 표시');
        }
      } catch (error) {
        console.error('토큰 확인 중 오류:', error);
      }
    };
    
    checkToken();
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* 로그인 관련 */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {/* <Stack.Screen name="Main" component={MainScreen} /> */}
        {/* 전체 탭 네비게이션 구조 */}
        <Stack.Screen name="Main" component={Navigation} />

        {/* 일반 화면 */}
        <Stack.Screen name="NutritionDetails" component={NutritionDetails} />
        <Stack.Screen
          name="FoodRecommendation"
          component={FoodRecommendation}
        />
        <Stack.Screen name="SupplementDetails" component={SupplementDetails} />
        <Stack.Screen name="MealRecord" component={MealRecords} />
        <Stack.Screen name="MealDetails" component={MealDetails} />
        <Stack.Screen name="FoodUpload" component={FoodUploadNavigator} />
        <Stack.Screen name="ProfileStack" component={ProfileNavigator} />

        {/* 설문조사 화면 */}
        <Stack.Screen
          name="SurveyGenderScreen"
          component={SurveyGenderScreen}
        />
        <Stack.Screen name="SurveyAgeScreen" component={SurveyAgeScreen} />
        <Stack.Screen
          name="SurveyHeightScreen"
          component={SurveyHeightScreen}
        />
        <Stack.Screen
          name="SurveyWeightScreen"
          component={SurveyWeightScreen}
        />
        <Stack.Screen
          name="SurveyHealthGoalsScreen"
          component={SurveyHealthGoalsScreen}
        />
        <Stack.Screen
          name="SurveyHealthConcernsScreen"
          component={SurveyHealthConcernsScreen}
        />
        <Stack.Screen
          name="SurveyAllergyScreen"
          component={SurveyAllergyScreen}
        />
        <Stack.Screen
          name="SurveyAllergyOkScreen"
          component={SurveyAllergyOkScreen}
        />
        <Stack.Screen
          name="SurveyDiseaseScreen"
          component={SurveyDiseaseScreen}
        />
        <Stack.Screen
          name="SurveyDiseaseOkScreen"
          component={SurveyDiseaseOkScreen}
        />
        <Stack.Screen
          name="SurveyFamilyHistoryScreen"
          component={SurveyFamilyHistoryScreen}
        />
        <Stack.Screen
          name="SurveyFamilyHistoryOkScreen"
          component={SurveyFamilyHistoryOkScreen}
        />
        <Stack.Screen
          name="SurveyMedicationScreen"
          component={SurveyMedicationScreen}
        />
        <Stack.Screen
          name="SurveyMedicationOkScreen"
          component={SurveyMedicationOkScreen}
        />
        <Stack.Screen
          name="SurveySupplementScreen"
          component={SurveySupplementScreen}
        />
        <Stack.Screen
          name="SurveySupplementOkScreen"
          component={SurveySupplementOkScreen}
        />
        <Stack.Screen
          name="SurveyExerciseScreen"
          component={SurveyExerciseScreen}
        />
        <Stack.Screen
          name="SurveySleepTimeScreen"
          component={SurveySleepTimeScreen}
        />
        <Stack.Screen name="SurveyMealScreen" component={SurveyMealScreen} />
        <Stack.Screen
          name="SurveyVegetableScreen"
          component={SurveyVegetableScreen}
        />
        <Stack.Screen name="SurveyWaterScreen" component={SurveyWaterScreen} />
        <Stack.Screen
          name="SurveySmokingScreen"
          component={SurveySmokingScreen}
        />
        <Stack.Screen name="SurveyDrinkScreen" component={SurveyDrinkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;