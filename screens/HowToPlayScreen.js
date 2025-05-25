import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';

const HowToPlayScreen = ({ onBack }) => {
  return (
    <ImageBackground
      source={require('../assets/game_background.png')}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>HOW TO PLAY</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Game Overview</Text>
            <Text style={styles.text}>
              Protect your network from cyber threats by managing different security challenges on your devices. Keep your Security Meter above 0% to stay in the game.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Security Meter</Text>
            <Text style={styles.text}>
              • Starts at 100%{'\n'}
              • Green (70-100%): Safe{'\n'}
              • Yellow (40-69%): Warning{'\n'}
              • Red (0-39%): Critical{'\n'}
              • Game Over if reaches 0%
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💻 Laptop Threats</Text>
            <Text style={styles.subTitle}>Antivirus Update:</Text>
            <Text style={styles.text}>
              • Update Success: +100 points{'\n'}
              • Skip Update: Risk of threats{'\n'}
            </Text>
            
            <Text style={styles.subTitle}>File Detection:</Text>
            <Text style={styles.text}>
              • Correct Identification: +200 points{'\n'}
              • Wrong Identification: -100 points, -10% security{'\n'}
              • Need 80% accuracy for success
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 Phone Threats</Text>
            <Text style={styles.subTitle}>Phishing Detection:</Text>
            <Text style={styles.text}>
              • Correct Identification: +300 points{'\n'}
              • Missing Suspicious Elements: -150 points{'\n'}
              • Wrong Choice: -150 points, -10% security{'\n'}
              • Find all suspicious elements to win
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📡 Modem Security</Text>
            <Text style={styles.subTitle}>Password Requirements:</Text>
            <Text style={styles.text}>
              • Minimum 8 characters{'\n'}
              • Must include uppercase & lowercase{'\n'}
              • Numbers and special characters required{'\n'}
              • Both passwords must match
            </Text>
            
            <Text style={styles.subTitle}>Outcomes:</Text>
            <Text style={styles.text}>
              • Strong Password: +400 points{'\n'}
              • Weak Password: -200 points{'\n'}
              • 3 Failed Attempts: -10% security
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌟 Bonus Points</Text>
            <Text style={styles.text}>
              • Perfect Security (100%): +1000 points{'\n'}
              • Quick Response: +50 points{'\n'}
              • Security Recovery: +50 points per 5%{'\n'}
              • Consecutive Success: Points multiplier
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Game Over Conditions</Text>
            <Text style={styles.text}>
              • Security Meter reaches 0%{'\n'}
              • Too many unhandled threats{'\n'}
              • Critical system compromise
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#4CD964',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HowToPlayScreen; 