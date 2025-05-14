import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  color?: string;
  size?: number;
  style?: object;
}

const LeftArrowIcon = ({color = '#731a22', size = 24, style = {}}: Props) => {
  return (
    <Ionicons name="chevron-back" size={size} color={color} style={style} />
  );
};

export default LeftArrowIcon;
