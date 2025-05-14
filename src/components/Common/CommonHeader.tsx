import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  title: string;
}

const CommonHeader = ({title}: Props) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <Wrapper>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={24} color="#731A22" />
      </BackButton>
      <Title>{title}</Title>
      <Underline />
    </Wrapper>
  );
};

export default CommonHeader;

const Wrapper = styled.View`
  background-color: #ffffff;
  padding-top: 11px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #731a22;
  text-align: center;
  margin-bottom: 11px;
`;

const Underline = styled.View`
  width: 100%;
  height: 1.3px;
  background-color: #731a22;
  margin-bottom: 6px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  left: 4px;
`;

const BackText = styled.Text`
  font-size: 20px;
  color: #731a22;
`;
