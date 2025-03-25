import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

const SettingsScreen = ({ onBack }) => {
  return (
    <ImageBackground
      source={require('../assets/game_background.png')} // Add your background image
      style={styles.background}
    >
      <View style={styles.overlay} /> {/* Dark overlay */}
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Adjust your preferences here.</Text>
        <Button title="Back to Start" onPress={onBack} />
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // White text for better contrast
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff', // White text for better contrast
    marginBottom: 20,
  },
});

export default SettingsScreen;