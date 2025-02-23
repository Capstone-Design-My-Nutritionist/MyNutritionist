import React from "react";
import { View, StyleSheet } from "react-native";
import { PrimaryButton, SecondaryButton } from "./src/components";

const App = () => {
  return (
    <View style={styles.container}>
      <PrimaryButton title="다음" />
      <SecondaryButton title="이전" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    gap: 10, // 버튼 간격 조절
  },
});

export default App;