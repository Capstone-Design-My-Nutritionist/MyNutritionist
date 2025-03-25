import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SupplementRecommendationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>영양제 추천 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SupplementRecommendationScreen;
