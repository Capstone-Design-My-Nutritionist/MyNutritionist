import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SurveyGenderScreen from './src/screens/Survey/SurveyGenderScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SurveyGender" component={SurveyGenderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
