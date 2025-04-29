import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Alert, Text, Modal, Button, TextInput, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device assets (Normal and Threat Versions)
const devices = [
  { normal: require('../assets/laptop.png'), threat: require('../assets/laptop_threat.png') },
  { normal: require('../assets/phone.png'), threat: require('../assets/phone_threat.png') },
  { normal: require('../assets/modem.png'), threat: require('../assets/modem_threat.png') },
];

const phishingMessages = [
  {
    title: 'EMAIL',
    email: 'facebull@gmail.com',
    body: `Dear [Player 1], We have detected unusu@l activity on your Facebook acC0unt and believe that your account may have been compromised. To pr0tect your information, we've temporarily suspended ur 4ccount.`,
    isPhishing: true,
    phishingElements: [
      { text: 'facebull@gmail.com', reason: 'Suspicious: This email uses "bull" instead of "book" - a common phishing tactic to trick users' },
      { text: '[Player 1]', reason: 'Suspicious: Real companies address you by your actual name, not a placeholder' },
      { text: 'unusu@l', reason: 'Suspicious: Using special characters (@) to replace normal letters is a common phishing tactic' },
      { text: 'acC0unt', reason: 'Suspicious: Using numbers (0) to replace letters is a sign of phishing' },
      { text: 'pr0tect', reason: 'Suspicious: Another instance of number (0) replacing letter O' },
      { text: 'ur', reason: 'Suspicious: Unprofessional abbreviated writing - legitimate companies use proper spelling' },
      { text: '4ccount', reason: 'Suspicious: Using numbers (4) to replace letters and poor spelling is a phishing red flag' },
    ]
  },
  {
    title: 'EMAIL',
    email: 'security@paypa1.com',
    body: `URGENT: Your PayPa1 account needs immediate verification. Click here to verify or your account will be permanently deleted within 24 hours.`,
    isPhishing: true,
    phishingElements: [
      { text: 'security@paypa1.com', reason: 'Suspicious: This email uses the number "1" instead of letter "l" in PayPal' },
      { text: 'URGENT', reason: 'Suspicious: Creating false urgency with capital letters is a common phishing tactic' },
      { text: 'PayPa1', reason: 'Suspicious: Misspelled brand name using number "1" instead of "l"' },
      { text: 'Click here', reason: 'Suspicious: Legitimate companies provide actual links, not vague "click here" text' },
      { text: 'permanently deleted', reason: 'Suspicious: Using threats of account deletion to create panic' },
    ]
  }
];

const legitMessages = [
  {
    title: ' EMAIL',
    email: 'support@amazon.com',
    body: `Dear Customer,

Your recent order has been shipped and is on its way! You can track your package using the link provided in your account.`,
    isPhishing: false,
  },
];

const GameScreen = ({ difficulty }) => {
  const [spawnedDevices, setSpawnedDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [scanProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setSpawnedDevices((prevDevices) => [
        ...prevDevices,
        {
          id: Math.random().toString(),
          type: Math.floor(Math.random() * devices.length),
          x: Math.random() * (width - 100),
          y: Math.random() * (height - 100),
          hasThreat: true, // Only spawn devices with threats
        },
      ]);
    }, difficulty === 'easy' ? 7000 : difficulty === 'medium' ? 5000 : 3000);

    return () => clearInterval(interval);
  }, [difficulty]);

  const handleDeviceClick = (device) => {
    if (device.hasThreat) {
      switch (device.type) {
        case 1: // Phone
          const isPhishing = Math.random() < 0.7; // 70% chance for phishing
          const messages = isPhishing ? phishingMessages : legitMessages;
          const randomIndex = Math.floor(Math.random() * messages.length);
          setCurrentMessage({ ...messages[randomIndex], device });
          setModalVisible(true);
          break;
        case 0: // Laptop
          setCurrentMessage({
            title: 'Antivirus',
            body: 'Scanning for threats...',
            device,
            type: 'scan'
          });
          setModalVisible(true);
          startScanAnimation();
          break;
        case 2: // Modem
          setCurrentMessage({
            title: 'Change Wi-Fi Password',
            body: 'Enter and confirm a new password to secure your modem.',
            device,
          }); // Pass the device to the modal
          setModalVisible(true);
          break;
        default:
          Alert.alert('No threat detected on this device.');
          break;
      }
    }
  };

  const startScanAnimation = () => {
    Animated.timing(scanProgress, {
      toValue: 1,
      duration: 3000, // 3 seconds to complete
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished) {
        // Animation completed, close modal and remove device
        setTimeout(() => {
          handleModalClose(currentMessage.device, true, 'Scan completed successfully!');
        }, 200);
      }
    });
  };

  const handleModalClose = (device, success, message) => {
    setModalVisible(false);
    setTimeout(() => {
      Alert.alert(
        success ? 'Success' : 'Incorrect',
        message || (success ? 'Threat resolved successfully!' : 'Try again!'),
        [{ text: 'OK' }]
      );
      setSpawnedDevices((prevDevices) => 
        prevDevices.filter((d) => d.id !== device.id)
      );
    }, 500);
  };

  return (
    <ImageBackground source={require('../assets/game_background.png')} style={styles.background}>
      {spawnedDevices.map((device) => (
        <TouchableOpacity key={device.id} onPress={() => handleDeviceClick(device)}>
          <Image
            source={devices[device.type].threat} // Only display threat icons
            style={[styles.device, { top: device.y, left: device.x }]}
          />
        </TouchableOpacity>
      ))}

      {/* Phishing/Legit Message Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {currentMessage && (
            <>
              {currentMessage.type === 'scan' ? (
                // Laptop antivirus scanning view
                <View style={styles.phoneFrame}>
                  <View style={styles.phoneHeader}>
                    <Text style={styles.headerText}>Antivirus Scanner</Text>
                  </View>
                  <View style={styles.scanContainer}>
                    <Text style={styles.scanText}>{currentMessage.body}</Text>
                    <View style={styles.progressBar}>
                      <Animated.View 
                        style={[
                          styles.progress,
                          {
                            width: scanProgress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%']
                            })
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              ) : currentMessage.title === 'Change Wi-Fi Password' ? (
                // Modem password change view
                <View style={styles.phoneFrame}>
                  <View style={styles.phoneHeader}>
                    <Text style={styles.headerText}>Wi-Fi Security</Text>
                  </View>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter new password"
                      secureTextEntry
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm new password"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#4CD964', width: '100%' }]}
                      onPress={() => {
                        if (newPassword === confirmPassword && newPassword.length >= 8) {
                          handleModalClose(currentMessage.device, true, 'Password changed successfully!');
                          setNewPassword('');
                          setConfirmPassword('');
                        } else {
                          Alert.alert(
                            'Error',
                            'Passwords must match and be at least 8 characters long'
                          );
                        }
                      }}
                    >
                      <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Email phishing detection view
                <>
                  <View style={styles.phoneFrame}>
                    <View style={styles.phoneHeader}>
                      <Text style={styles.headerText}>Email</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => {
                        if (currentMessage.isPhishing) {
                          const emailElement = currentMessage.phishingElements?.find(e => e.text === currentMessage.email);
                          if (emailElement) {
                            Alert.alert('Suspicious Element', emailElement.reason);
                          }
                        }
                      }}
                    >
                      <Text style={[
                        styles.emailText,
                        currentMessage.isPhishing && styles.clickableText
                      ]}>
                        {currentMessage.email}
                      </Text>
                    </TouchableOpacity>
                    
                    <View style={styles.messageContainer}>
                      {currentMessage.body.split(' ').map((word, index) => {
                        // Clean the word from punctuation
                        const cleanWord = word.replace(/[.,!?]$/g, '');
                        
                        const phishingElement = currentMessage.phishingElements?.find(
                          element => {
                            // Check for exact match
                            if (element.text.toLowerCase() === cleanWord.toLowerCase()) {
                              return true;
                            }
                            
                            // Check for phrases (multiple words)
                            if (currentMessage.body.toLowerCase().includes(element.text.toLowerCase())) {
                              const phrase = element.text.toLowerCase();
                              const startIndex = currentMessage.body.toLowerCase().indexOf(phrase);
                              const endIndex = startIndex + phrase.length;
                              const currentWordStart = currentMessage.body.toLowerCase().indexOf(cleanWord.toLowerCase());
                              
                              return currentWordStart >= startIndex && currentWordStart < endIndex;
                            }
                            
                            return false;
                          }
                        );
                        
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              if (phishingElement) {
                                Alert.alert('Suspicious Element Found!', phishingElement.reason);
                              }
                            }}
                            style={styles.wordWrapper}
                          >
                            <Text style={styles.messageText}>
                              {word}{' '}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#4CD964' }]}
                      onPress={() => {
                        if (currentMessage.isPhishing) {
                          handleModalClose(currentMessage.device, true, 
                            'Correct! This is a phishing attempt. Look for suspicious elements.');
                        } else {
                          handleModalClose(currentMessage.device, false, 
                            'Incorrect! This was a legitimate message.');
                        }
                      }}
                    >
                      <Text style={styles.buttonText}>PHISHING</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                      onPress={() => {
                        if (!currentMessage.isPhishing) {
                          handleModalClose(currentMessage.device, true, 
                            'Correct! This was a legitimate message.');
                        } else {
                          handleModalClose(currentMessage.device, false, 
                            'Incorrect! This was a phishing attempt. Try to spot the suspicious elements.');
                        }
                      }}
                    >
                      <Text style={styles.buttonText}>NOT PHISHING</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  device: {
    width: 150,
    height: 150,
    position: 'absolute',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    color: '#000', 
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  phoneFrame: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  phoneHeader: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  scanContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scanText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CD964',
    animation: 'progress 2s infinite linear',
  },
  passwordContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  wordWrapper: {
    marginRight: 4,
  },
});

export default GameScreen;
