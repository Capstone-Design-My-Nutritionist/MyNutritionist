import React, {useEffect, useRef} from 'react';
import {Animated, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';

interface CustomToggleProps {
  value: boolean;
  onToggle: () => void;
}

const CustomToggle: React.FC<CustomToggleProps> = ({value, onToggle}) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 11],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#D95B72'],
  });

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <AnimatedToggleContainer style={{backgroundColor}}>
        <AnimatedCircle style={{transform: [{translateX}]}} />
      </AnimatedToggleContainer>
    </TouchableWithoutFeedback>
  );
};

export default CustomToggle;

const AnimatedToggleContainer = styled(Animated.View)`
  width: 25px;
  height: 14px;
  border-radius: 7px;
  padding: 2px;
  justify-content: center;
`;

const AnimatedCircle = styled(Animated.View)`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
`;
