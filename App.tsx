import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Navigation from './src/navigation/Navigation';

import SurveyGenderScreen from './src/screens/Survey/SurveyGenderScreen';
import SurveyAgeScreen from './src/screens/Survey/SurveyAgeScreen';
import SurveyMedicationOkScreen from './src/screens/Survey/SurveyMedicationOkScreen';
import SurveySupplementOkScreen from './src/screens/Survey/SurveySupplementOkScreen';
import SurveyFamilyHistoryOkScreen from './src/screens/Survey/SurveyFamilyHistoryOkScreen';
import SurveyDiseaseOkScreen from './src/screens/Survey/SurveyDiseaseOkScreen';
import SurveyAllergyOkScreen from './src/screens/Survey/SurveyAllergyOkScreen';
import SurveyHeightScreen from './src/screens/Survey/SurveyHeightScreen';
import SurveyMealScreen from './src/screens/Survey/SurveyMealScreen';
import SurveyWeightScreen from './src/screens/Survey/SurveyWeightScreen';
import SurveyHealthGoalsScreen from './src/screens/Survey/SurveyHealthGoalsScreen';
import SurveyHealthConcernsScreen from './src/screens/Survey/SurveyHealthConcernsScreen';
import SurveySleepTimeScreen from './src/screens/Survey/SurveySleepTimeScreen';
import SurveyVegetableScreen from './src/screens/Survey/SurveyVegetableScreen';
import SurveyWaterScreen from './src/screens/Survey/SurveyWaterScreen';
import SurveySmokingScreen from './src/screens/Survey/SurveySmokingScreen';
import SurveyExerciseScreen from './src/screens/Survey/SurveyExerciseScreen';
import SurveyAllergyScreen from './src/screens/Survey/SurveyAllergyScreen';
import SurveyDrinkScreen from './src/screens/Survey/SurveyDrinkScreen';
import SurveySupplementScreen from './src/screens/Survey/SurveySupplementScreen';
import SurveyMedicationScreen from './src/screens/Survey/SurveyMedicationScreen';
import SurveyDiseaseScreen from './src/screens/Survey/SurveyDiseaseScreen';
import SurveyFamilyHistoryScreen from './src/screens/Survey/SurveyFamilyHistoryScreen';

import ProfileScreen from './src/screens/UserSettings/ProfileScreen';
import PasswordVerifyScreen from './src/screens/UserSettings/PasswordVerifyScreen';
import PasswordChangeScreen from './src/screens/UserSettings/PasswordChangeScreen';
// import NicknameChangeScreen from './src/screens/UserSettings/NicknameChangeScreen';
// import AccountDeleteScreen from './src/screens/UserSettings/AccountDeleteScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ProfileScreen" // 시작 스크린 설정
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen
          name="PasswordVerifyScreen"
          component={PasswordVerifyScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PasswordChangeScreen"
          component={PasswordChangeScreen}
        />
        {/* <Stack.Screen
          name="NicknameChangeScreen"
          component={NicknameChangeScreen}
        /> */}
        {/* <Stack.Screen
          name="AccountDeleteScreen"
          component={AccountDeleteScreen}
        /> */}

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
          name="SurveyMedicationOkScreen"
          component={SurveyMedicationOkScreen}
        />
        <Stack.Screen
          name="SurveyMedicationScreen"
          component={SurveyMedicationScreen}
        />
        <Stack.Screen
          name="SurveySupplementOkScreen"
          component={SurveySupplementOkScreen}
        />
        <Stack.Screen
          name="SurveySupplementScreen"
          component={SurveySupplementScreen}
        />
        <Stack.Screen
          name="SurveyDiseaseOkScreen"
          component={SurveyDiseaseOkScreen}
        />
        <Stack.Screen
          name="SurveyDiseaseScreen"
          component={SurveyDiseaseScreen}
        />
        <Stack.Screen
          name="SurveyFamilyHistoryOkScreen"
          component={SurveyFamilyHistoryOkScreen}
        />
        <Stack.Screen
          name="SurveyFamilyHistoryScreen"
          component={SurveyFamilyHistoryScreen}
        />
        <Stack.Screen
          name="SurveyHealthConcernsScreen"
          component={SurveyHealthConcernsScreen}
        />
        <Stack.Screen
          name="SurveyHealthGoalsScreen"
          component={SurveyHealthGoalsScreen}
        />
        <Stack.Screen
          name="SurveySleepTimeScreen"
          component={SurveySleepTimeScreen}
        />
        <Stack.Screen
          name="SurveyExerciseScreen"
          component={SurveyExerciseScreen}
        />
        <Stack.Screen name="SurveyMealScreen" component={SurveyMealScreen} />
        <Stack.Screen
          name="SurveyVegetableScreen"
          component={SurveyVegetableScreen}
        />
        <Stack.Screen name="SurveyWaterScreen" component={SurveyWaterScreen} />
        <Stack.Screen name="SurveyDrinkScreen" component={SurveyDrinkScreen} />
        <Stack.Screen
          name="SurveySmokingScreen"
          component={SurveySmokingScreen}
        />
        <Stack.Screen
          name="SurveyAllergyOkScreen"
          component={SurveyAllergyOkScreen}
        />
        <Stack.Screen
          name="SurveyAllergyScreen"
          component={SurveyAllergyScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
