import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import GameScreen from './screens/GameScreen';
import StartScreen from './screens/StartScreen';
import DifficultyScreen from './screens/DifficultyScreen'; // Import the new DifficultyScreen
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('start'); // Manage the current screen
  const [difficulty, setDifficulty] = useState('easy'); // Manage the selected difficulty

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'start' ? (
        <StartScreen
          onNavigateToDifficulty={() => setCurrentScreen('difficulty')} // Navigate to DifficultyScreen
          onOpenSettings={() => setCurrentScreen('settings')} // Navigate to SettingsScreen
        />
      ) : currentScreen === 'difficulty' ? (
        <DifficultyScreen
          onSelectDifficulty={(selectedDifficulty) => {
            setDifficulty(selectedDifficulty); // Set the selected difficulty
            setCurrentScreen('game'); // Navigate to GameScreen
          }}
        />
      ) : currentScreen === 'settings' ? (
        <SettingsScreen onBack={() => setCurrentScreen('start')} /> // Navigate back to StartScreen
      ) : (
        <GameScreen 
          difficulty={difficulty} 
          onBack={() => setCurrentScreen('start')} // Add onBack prop to return to start screen
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
