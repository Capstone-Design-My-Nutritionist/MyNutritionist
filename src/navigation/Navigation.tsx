import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/Main/HomeScreen';
import SupplementRecommendationScreen from '../screens/Supplement/SupplementRecommendationScreen';
// Import the FoodUploadNavigator and tab bar visibility function
import FoodUploadNavigator, {getTabBarVisibility} from './FoodUploadNavigator';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import ProfileScreen from '../screens/UserSettings/ProfileScreen';

const Tab = createBottomTabNavigator();

// Define colors
const ACTIVE_COLOR = '#BF0404'; // Reddish tone for active tab
const INACTIVE_COLOR = '#9E9E9E'; // Gray tone for inactive tabs
const UPLOAD_BUTTON_COLOR = '#E44F68'; // Keeping the original upload button color

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: route.name !== 'Upload',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarIcon: ({focused, color, size}) => {
          // Map route names to icon names from MaterialCommunityIcons
          const iconName: string =
            {
              Home: 'home',
              Supplements: 'shopping',
              Upload: 'plus',
              Calendar: 'calendar-month',
              Profile: 'account',
            }[route.name] || '';

          // Upload button placeholder
          if (route.name === 'Upload') {
            return <View style={{width: 70}} />;
          }

          return (
            <IconWrapper focused={focused}>
              <Icon name={iconName} size={26} color={color} />
            </IconWrapper>
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: '홈'}}
      />
      <Tab.Screen
        name="Supplements"
        component={SupplementRecommendationScreen}
        options={{tabBarLabel: '영양제'}}
      />
      <Tab.Screen
        name="Upload"
        component={FoodUploadNavigator}
        options={({route}) => {
          const tabBarVisibility = getTabBarVisibility(route);
          return {
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <UploadButtonContainer>
                <UploadButton>
                  <Icon name="camera-plus" size={32} color="#FFFFFF" />
                </UploadButton>
              </UploadButtonContainer>
            ),
            tabBarStyle: tabBarVisibility.tabBarStyle
              ? {
                  display: 'none',
                  position: 'absolute',
                  height: 0,
                }
              : styles.tabBar,
          };
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{tabBarLabel: '캘린더'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{tabBarLabel: '프로필'}}
      />
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabBarLabel: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
});

const IconWrapper = styled.View<{focused: boolean}>`
  align-items: center;
  justify-content: center;
  height: 50px;
  padding-top: 10px;
  opacity: ${(props: {focused: boolean}) => (props.focused ? 1 : 0.8)};
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
  background-color: ${UPLOAD_BUTTON_COLOR};
  border-radius: 35px;
  justify-content: center;
  align-items: center;
  border: 5px solid #ffffff;
`;
