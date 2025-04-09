import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  disabled?: boolean;
  size?: number;
  style?: object;
}

const RightArrowIcon = ({disabled = false, size = 20, style = {}}: Props) => {
  return (
    <Ionicons
      name="chevron-forward"
      size={size}
      color={disabled ? '#999999' : '#d95b72'}
      style={[{marginRight: -6}, style]}
    />
  );
};

export default RightArrowIcon;
