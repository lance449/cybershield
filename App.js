import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import GameScreen from './screens/GameScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <GameScreen /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
