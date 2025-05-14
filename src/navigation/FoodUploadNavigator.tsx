import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FoodUploadScreen from '../screens/FoodUpload/FoodUploadScreen';
import FoodUploadResultScreen from '../screens/FoodUpload/FoodUploadResultScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const FoodUploadStack = createNativeStackNavigator();

// 이 함수는 Tab.Navigator에서 사용되어 FoodUploadResultScreen에서 탭바를 숨깁니다
export const getTabBarVisibility = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'FoodUploadScreen';
  if (routeName === 'FoodUploadResultScreen') {
    return { tabBarStyle: { display: 'none' } };
  }
  return {};
};

const FoodUploadNavigator = () => {
  return (
    <FoodUploadStack.Navigator
      initialRouteName="FoodUploadScreen"
      screenOptions={{headerShown: false}}>
      <FoodUploadStack.Screen
        name="FoodUploadScreen"
        component={FoodUploadScreen}
      />
      <FoodUploadStack.Screen
        name="FoodUploadResultScreen"
        component={FoodUploadResultScreen}
      />
    </FoodUploadStack.Navigator>
  );
};

export default FoodUploadNavigator;
