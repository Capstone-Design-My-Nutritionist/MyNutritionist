import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Navigation from './src/navigation/Navigation';
import NutritionDetails from './src/screens/Main/NutritionDetailsScreen';
import FoodRecommendation from './src/screens/Main/FoodRecommendationScreen';
import SupplementDetails from './src/screens/Supplement/SupplementDetailsScreen';
import MealRecords from './src/screens/Main/MealRecordsScreen';
import MealDetails from './src/screens/Calendar/MealDetailsScreen';
import FoodUploadScreen from './src/screens/FoodUpload/FoodUploadScreen';
import FoodUploadResultScreen from './src/screens/FoodUpload/FoodUploadResultScreen';
import ProfileScreen from './src/screens/UserSettings/ProfileScreen';
import PasswordVerifyScreen from './src/screens/UserSettings/PasswordVerifyScreen';
import PasswordChangeScreen from './src/screens/UserSettings/PasswordChangeScreen';
import NicknameChangeScreen from './src/screens/UserSettings/NicknameChangeScreen';
import AccountDeleteScreen from './src/screens/UserSettings/AccountDeleteScreen';

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

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 메인 탭 */}
        <Stack.Screen name="Main" component={Navigation} />

        {/* 일반 화면 */}
        <Stack.Screen name="NutritionDetails" component={NutritionDetails} />
        <Stack.Screen name="FoodRecommendation" component={FoodRecommendation} />
        <Stack.Screen name="SupplementDetails" component={SupplementDetails} /> 
        <Stack.Screen name="MealRecord" component={MealRecords} />
        <Stack.Screen name="MealDetails" component={MealDetails} />
        <Stack.Screen name="FoodUploadScreen" component={FoodUploadScreen} />
        <Stack.Screen name="FoodUploadResultScreen" component={FoodUploadResultScreen as any} />
        
        {/* 프로필 관련 */}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="PasswordVerifyScreen" component={PasswordVerifyScreen} />
        <Stack.Screen name="PasswordChangeScreen" component={PasswordChangeScreen} />
        <Stack.Screen name="NicknameChangeScreen" component={NicknameChangeScreen} />
        <Stack.Screen name="AccountDeleteScreen" component={AccountDeleteScreen} />

        {/* 설문조사 */}
        <Stack.Screen name="SurveyGenderScreen" component={SurveyGenderScreen} />
        <Stack.Screen name="SurveyAgeScreen" component={SurveyAgeScreen} />
        <Stack.Screen name="SurveyHeightScreen" component={SurveyHeightScreen} />
        <Stack.Screen name="SurveyWeightScreen" component={SurveyWeightScreen} />
        <Stack.Screen name="SurveyHealthGoalsScreen" component={SurveyHealthGoalsScreen} />
        <Stack.Screen name="SurveyHealthConcernsScreen" component={SurveyHealthConcernsScreen} />
        <Stack.Screen name="SurveyAllergyScreen" component={SurveyAllergyScreen} />
        <Stack.Screen name="SurveyAllergyOkScreen" component={SurveyAllergyOkScreen} />
        <Stack.Screen name="SurveyDiseaseScreen" component={SurveyDiseaseScreen} />
        <Stack.Screen name="SurveyDiseaseOkScreen" component={SurveyDiseaseOkScreen} />
        <Stack.Screen name="SurveyFamilyHistoryScreen" component={SurveyFamilyHistoryScreen} />
        <Stack.Screen name="SurveyFamilyHistoryOkScreen" component={SurveyFamilyHistoryOkScreen} />
        <Stack.Screen name="SurveyMedicationScreen" component={SurveyMedicationScreen} />
        <Stack.Screen name="SurveyMedicationOkScreen" component={SurveyMedicationOkScreen} />
        <Stack.Screen name="SurveySupplementScreen" component={SurveySupplementScreen} />
        <Stack.Screen name="SurveySupplementOkScreen" component={SurveySupplementOkScreen} />
        <Stack.Screen name="SurveyExerciseScreen" component={SurveyExerciseScreen} />
        <Stack.Screen name="SurveySleepTimeScreen" component={SurveySleepTimeScreen} />
        <Stack.Screen name="SurveyMealScreen" component={SurveyMealScreen} />
        <Stack.Screen name="SurveyVegetableScreen" component={SurveyVegetableScreen} />
        <Stack.Screen name="SurveyWaterScreen" component={SurveyWaterScreen} />
        <Stack.Screen name="SurveySmokingScreen" component={SurveySmokingScreen} />
        <Stack.Screen name="SurveyDrinkScreen" component={SurveyDrinkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;