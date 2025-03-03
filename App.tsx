import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SurveyGenderScreen from './src/screens/Survey/SurveyGenderScreen';
import SurveyAgeScreen from './src/screens/Survey/SurveyAgeScreen';
// import SurveyHeightScreen from './src/screens/Survey/SurveyHeightScreen'; // ✅ 추가

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SurveyAgeScreen" component={SurveyAgeScreen} />
        <Stack.Screen
          name="SurveyGenderScreen"
          component={SurveyGenderScreen}
        />
        {/* <Stack.Screen
          name="SurveyHeightScreen"
          component={SurveyHeightScreen}
        />{' '} */}
        {/* ✅ 추가 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
