import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const DifficultyScreen = ({ onSelectDifficulty }) => {
  return (
    <ImageBackground
      source={require('../assets/game_background.png')} // Add your background image
      style={styles.background}
    >
      <View style={styles.overlay} /> {/* Dark overlay */}
      <View style={styles.container}>
        <Text style={styles.title}>DIFFICULTY</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#32CD32' }]} // Green for Easy
          onPress={() => onSelectDifficulty('easy')}
        >
          <Text style={styles.buttonText}>EASY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFD700' }]} // Yellow for Medium
          onPress={() => onSelectDifficulty('medium')}
        >
          <Text style={styles.buttonText}>MEDIUM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF4500' }]} // Red for Hard
          onPress={() => onSelectDifficulty('hard')}
        >
          <Text style={styles.buttonText}>HARD</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // White text for the title
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for buttons
  },
});

export default DifficultyScreen;