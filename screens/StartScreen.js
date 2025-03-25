import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const StartScreen = ({ onNavigateToDifficulty, onOpenSettings }) => {
  return (
    <ImageBackground
      source={require('../assets/game_background.png')} // Add your background image
      style={styles.background}
    >
      <View style={styles.overlay} /> {/* Dark overlay */}
      <View style={styles.container}>
        <Text style={styles.title}>CYBERSHIELD</Text>
        <Text style={styles.subtitle}>DEFEND THE GRID</Text>
        <TouchableOpacity style={styles.button} onPress={onNavigateToDifficulty}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onOpenSettings}>
          <Text style={styles.buttonText}>SETTINGS</Text>
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
    color: '#00FFFF', // Cyan color for the title
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#00FFFF', // Cyan color for the subtitle
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#32CD32', // Green button color
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

export default StartScreen;