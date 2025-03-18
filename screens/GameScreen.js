import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Alert, TextInput, Button, Modal, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device assets (Normal and Threat Versions)
const devices = [
  { normal: require('../assets/laptop.png'), threat: require('../assets/laptop_threat.png') },
  { normal: require('../assets/phone.png'), threat: require('../assets/phone_threat.png') },
  { normal: require('../assets/modem.png'), threat: require('../assets/modem_threat.png') },
];

const GameScreen = () => {
  const [spawnedDevices, setSpawnedDevices] = useState([]);
  const [wifiPassword, setWifiPassword] = useState('');
  const [confirmWifiPassword, setConfirmWifiPassword] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setSpawnedDevices((prevDevices) => [
        ...prevDevices,
        {
          id: Math.random().toString(),
          type: Math.floor(Math.random() * devices.length),
          x: Math.random() * (width - 100), // Adjust for better positioning
          y: Math.random() * (height - 100),
          hasThreat: Math.random() < 0.5, // 50% chance to have a threat
        },
      ]);
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, []);

  const handleDeviceClick = (device) => {
    if (device.hasThreat) {
      switch (device.type) {
        case 0: // Laptop
          Alert.alert(
            'Threat Detected',
            'Click the button to run antivirus scan.',
            [
              { text: 'Run Antivirus', onPress: () => {
                Alert.alert('Antivirus', 'Scanning...');
                setTimeout(() => {
                  Alert.alert('Antivirus', 'Scanning... Threat removed!');
                }, 5000); // 5 seconds delay
              }},
            ]
          );
          break;
        case 1: // Phone
          const randomEmail = Math.random() < 0.5 ? 'phishing@example.com' : 'legit@example.com';
          Alert.alert(
            'Threat Detected',
            `Email: ${randomEmail}\nIdentify if the email is phishing or not.`,
            [
              { text: 'Phishing', onPress: () => Alert.alert('Result', 'Threat removed!') },
              { text: 'Not Phishing', onPress: () => Alert.alert('Result', 'No threat detected.') },
            ]
          );
          break;
        case 2: // Modem
          setModalVisible(true);
          break;
        default:
          break;
      }
    }
  };

  const handlePasswordChange = () => {
    if (!wifiPassword) {
      setPasswordError('Please enter the new password.');
      return;
    }
    if (!confirmWifiPassword) {
      setPasswordError('Please enter the confirm password.');
      return;
    }
    if (wifiPassword !== confirmWifiPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }
    setPasswordError('');
    setModalVisible(false);
    Alert.alert('Password Changed', 'Threat removed!');
  };

  return (
    <ImageBackground source={require('../assets/game_background.png')} style={styles.background}>
      {spawnedDevices.map((device) => (
        <TouchableOpacity key={device.id} onPress={() => handleDeviceClick(device)}>
          <Image
            source={device.hasThreat ? devices[device.type].threat : devices[device.type].normal}
            style={[styles.device, { top: device.y, left: device.x }]}
          />
        </TouchableOpacity>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="New Password"
            value={wifiPassword}
            onChangeText={setWifiPassword}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Confirm Password"
            value={confirmWifiPassword}
            onChangeText={setConfirmWifiPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          <Button title="Change Password" onPress={handlePasswordChange} />
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  device: {
    width: 150, // Increased size for better visibility
    height: 150,
    position: 'absolute',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default GameScreen;
