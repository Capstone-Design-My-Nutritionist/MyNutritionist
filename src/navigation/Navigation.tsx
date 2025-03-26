import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';

import HomeScreen from '../screens/Main/HomeScreen';
import SupplementRecommendationScreen from '../screens/Supplement/SupplementRecommendationScreen';
import UploadScreen from '../screens/FoodUpload/FoodUploadScreen';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import ProfileScreen from '../screens/UserSettings/ProfileScreen';

import HomeIcon from '../assets/icons/HomeIcon.svg';
import SupplementIcon from '../assets/icons/SupplementIcon.svg';
import UploadIcon from '../assets/icons/UploadIcon.svg';
import CalendarIcon from '../assets/icons/CalendarIcon.svg';
import ProfileIcon from '../assets/icons/ProfileIcon.svg';

import {SvgProps} from 'react-native-svg';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({focused}) => {
          const icons: {[key: string]: React.FC<SvgProps>} = {
            Home: HomeIcon,
            Supplements: SupplementIcon,
            Upload: UploadIcon,
            Calendar: CalendarIcon,
            Profile: ProfileIcon,
          };

          const sizes: {[key: string]: {width: number; height: number}} = {
            Home: {width: 30, height: 25},
            Supplements: {width: 32, height: 28},
            Upload: {width: 28, height: 28},
            Calendar: {width: 26, height: 25},
            Profile: {width: 24, height: 25},
          };

          const Icon = icons[route.name];
          const color =
            route.name === 'Upload'
              ? '#E44F68'
              : focused
              ? '#BF0404'
              : '#D9D9D9';

          const size = sizes[route.name];

          // Upload 자리에는 빈 View를 리턴해서 정렬 유지
          if (route.name === 'Upload') {
            return <View style={{width: 70}} />;
          }

          return (
            <IconWrapper>
              <Icon width={size.width} height={size.height} fill={color} />
            </IconWrapper>
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Supplements"
        component={SupplementRecommendationScreen}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarIcon: () => (
            <UploadButtonContainer>
              <UploadButton>
                <UploadIcon width={58} height={58} />
              </UploadButton>
            </UploadButtonContainer>
          ),
        }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 0,
  },
});

const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const UploadButtonContainer = styled.View`
  position: absolute;
  top: -30px;
  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const UploadButton = styled.View`
  width: 70px;
  height: 70px;
  background-color: #e44f68;
  border-radius: 35px;
  justify-content: center;
  align-items: center;
  border: 5px solid #ffffff;
`;
