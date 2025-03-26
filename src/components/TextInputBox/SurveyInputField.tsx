import React from 'react';
import styled from 'styled-components/native';
import {TextInputProps} from 'react-native';

interface SurveyInputFieldProps extends TextInputProps {
  label: string;
}

const SurveyInputField: React.FC<SurveyInputFieldProps> = ({
  label,
  ...props
}) => {
  return (
    <Container>
      <StyledInput {...props} placeholderTextColor="#6c6c6c" />
      <Label>{label}</Label>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.Text`
  font-size: 24px;
  font-family: 'Pretendard-Bold';
  color: #111111;
`;

const StyledInput = styled.TextInput`
  width: 284px;
  height: 40px;
  font-size: 16px;
  font-family: 'Pretendard-SemiBold';
  color: #111111;
  padding: 0px 12px;
  border: 1.5px solid;
  border-color: #111111;
  border-radius: 12px;
  text-align: right;
`;

export default SurveyInputField;
