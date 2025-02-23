import React from "react";
import { View, StyleSheet } from "react-native";
import { LoginInputField, SurveyInputField } from "./src/components";


const App = () => {
  return (
    <View style={styles.container}>
      <LoginInputField label="아이디" placeholder="아이디를 입력하세요" />
      <SurveyInputField label="세" placeholder="나이를 입력해주세요." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    gap: 20, 
  },
});

export default App;