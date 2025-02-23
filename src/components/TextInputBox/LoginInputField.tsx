import React from "react";
import styled from "styled-components/native";
import { TextInputProps } from "react-native";

interface LoginInputFieldProps extends TextInputProps {
  label: string;
}

const LoginInputField: React.FC<LoginInputFieldProps> = ({ label, ...props }) => {
  return (
    <Container>
      <Label>{label}</Label>
      <InputBox {...props} placeholderTextColor="#6c6c6c" />
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 6px; 
`;

const Label = styled.Text`
  font-size: 14px;
  font-family: "Pretendard-Bold";
  color: #111111;
  margin-bottom: 6px;
`;

const InputBox = styled.TextInput`
  width: 300px;
  height: 30px;
  font-size: 12px;
  font-family: "Pretendard-SemiBold";
  color: #111111;
  padding: 8px 12px;
  border: 1.5px solid;
  border-color: "#111111";
  border-radius: 8px;
`;

export default LoginInputField;