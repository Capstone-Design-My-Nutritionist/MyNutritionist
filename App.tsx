import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SurveyGenderScreen from './src/screens/Survey/SurveyGenderScreen';
import SurveyAgeScreen from './src/screens/Survey/SurveyAgeScreen';
import SurveyMedicationOkScreen from './src/screens/Survey/SurveyMedicationOkScreen';
import SurveySupplementOkScreen from './src/screens/Survey/SurveySupplementOkScreen';
import SurveyFamilyHistoryOkScreen from './src/screens/Survey/SurveyFamilyHistoryOkScreen';
import SurveyDiseaseOkScreen from './src/screens/Survey/SurveyDiseaseOkScreen';
import SurveyAllergyOkScreen from './src/screens/Survey/SurveyAllergyOkScreen';
import SurveyHeightScreen from './src/screens/Survey/SurveyHeightScreen';
import SurveyMealScreen from './src/screens/Survey/SurveyMealScreen';
import SurveyWeightScreen from './src/screens/Survey/SuveyWeightScreen';
import SurveyHealthGoalsScreen from './src/screens/Survey/SurveyHealthGoalsScreen';
import SurveyHealthConcernsScreen from './src/screens/Survey/SurveyHealthConcernsScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="SurveyAgeScreen" component={SurveyAgeScreen} /> */}
        {/* <Stack.Screen
          name="SurveyHeightScreen"
          component={SurveyHeightScreen}
        /> */}
        {/* <Stack.Screen name="SurveyMealScreen" component={SurveyMealScreen} /> */}
        {/* <Stack.Screen
          name="SurveyWeightScreen"
          component={SurveyWeightScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyGenderScreen"
          component={SurveyGenderScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyMedicationOkScreen"
          component={SurveyMedicationOkScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveySupplementOkScreen"
          component={SurveySupplementOkScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyFamilyHistoryOkScreen"
          component={SurveyFamilyHistoryOkScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyDiseaseOkScreen"
          component={SurveyDiseaseOkScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyAllergyOkScreen"
          component={SurveyAllergyOkScreen}
        /> */}
        {/* <Stack.Screen
          name="SurveyHealthGoalsScreen"
          component={SurveyHealthGoalsScreen}
        /> */}
        <Stack.Screen
          name="SurveyHealthConcernsScreen"
          component={SurveyHealthConcernsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
