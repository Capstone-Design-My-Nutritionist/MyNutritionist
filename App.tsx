import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SurveyGenderScreen from './src/screens/Survey/SurveyGenderScreen';
import SurveyAgeScreen from './src/screens/Survey/SurveyAgeScreen';
// import SurveyHeightScreen from './src/screens/Survey/SurveyHeightScreen'; // ✅ 추가
import SurveyMedicationOkScreen from './src/screens/Survey/SurveyMedicationOkScreen';
import SurveySupplementOkScreen from './src/screens/Survey/SurveySupplementOkScreen';
import SurveyFamilyHistoryOkScreen from './src/screens/Survey/SurveyFamilyHistoryOkScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="SurveyAgeScreen" component={SurveyAgeScreen} /> */}
        {/* <Stack.Screen
          name="SurveyGenderScreen"
          component={SurveyGenderScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyHeightScreen"
          component={SurveyHeightScreen}
        />{' '} */}
        {/* <Stack.Screen
          name="SurveyMedicationOkScreen"
          component={SurveyMedicationOkScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveySupplementOkScreen"
          component={SurveySupplementOkScreen}
        /> */}
        <Stack.Screen
          name="SurveyFamilyHistoryOkScreen"
          component={SurveyFamilyHistoryOkScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
