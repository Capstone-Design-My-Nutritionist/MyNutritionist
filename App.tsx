// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// BottomTab이 정의된 Navigation 컴포넌트 불러오기
import Navigation from './src/navigation/Navigation';
import NutritionDetails from './src/screens/Main/NutritionDetailsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 전체 탭 네비게이션 구조 */}
        <Stack.Screen name="Main" component={Navigation} />
        {/* 탭 외의 상세 페이지는 여기에서 관리 */}
        <Stack.Screen name="NutritionDetails" component={NutritionDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;