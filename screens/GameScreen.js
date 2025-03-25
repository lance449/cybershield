import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Alert, Text, Modal, Button, TextInput } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device assets (Normal and Threat Versions)
const devices = [
  { normal: require('../assets/laptop.png'), threat: require('../assets/laptop_threat.png') },
  { normal: require('../assets/phone.png'), threat: require('../assets/phone_threat.png') },
  { normal: require('../assets/modem.png'), threat: require('../assets/modem_threat.png') },
];

const phishingMessages = [
  {
    title: 'PHISHING ATTACK',
    email: 'facebull@gmail.com',
    body: `Dear [Player 1],

We have detected unusu@l activity on your Facebook account and believe that your acc0unt may have been compromised. To pr0tect your information, we’ve temporarily suspended your account.`,
    isPhishing: true,
  },
];

const legitMessages = [
  {
    title: 'LEGITIMATE EMAIL',
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

  useEffect(() => {
    const interval = setInterval(() => {
      setSpawnedDevices((prevDevices) => [
        ...prevDevices,
        {
          id: Math.random().toString(),
          type: Math.floor(Math.random() * devices.length),
          x: Math.random() * (width - 100),
          y: Math.random() * (height - 100),
          hasThreat: Math.random() < 0.5,
        },
      ]);
    }, difficulty === 'easy' ? 7000 : difficulty === 'medium' ? 5000 : 3000);

    return () => clearInterval(interval);
  }, [difficulty]);

  const handleDeviceClick = (device) => {
    if (device.hasThreat) {
      switch (device.type) {
        case 1: // Phone
          const isPhishing = Math.random() < 0.5; // 50% chance for phishing or legit
          const message = isPhishing
            ? phishingMessages[Math.floor(Math.random() * phishingMessages.length)]
            : legitMessages[Math.floor(Math.random() * legitMessages.length)];
          setCurrentMessage(message);
          setModalVisible(true);
          break;
        case 0: // Laptop
          Alert.alert('Scanning...', 'Antivirus is scanning for threats.');
          setTimeout(() => {
            Alert.alert('Scan Complete', 'Threat removed successfully!');
          }, 3000); // Simulate a 3-second scan
          break;
        case 2: // Modem
          setModalVisible(true);
          setCurrentMessage({
            title: 'Change Wi-Fi Password',
            body: 'Enter and confirm a new password to secure your modem.',
          });
          break;
        default:
          Alert.alert('No threat detected on this device.');
          break;
      }
    }
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
              <Text style={styles.modalTitle}>{currentMessage.title}</Text>
              {currentMessage.body && <Text style={styles.modalBody}>{currentMessage.body}</Text>}
              {currentMessage.title === 'Change Wi-Fi Password' ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new Wi-Fi password"
                    secureTextEntry={true}
                    onChangeText={(text) => setNewPassword(text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    secureTextEntry={true}
                    onChangeText={(text) => setConfirmPassword(text)}
                  />
                  <Button
                    title="Submit"
                    onPress={() => {
                      if (newPassword === confirmPassword) {
                        Alert.alert('Success', 'Password changed successfully!');
                        setModalVisible(false);
                      } else {
                        Alert.alert('Error', 'Passwords do not match.');
                      }
                    }}
                  />
                </>
              ) : (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#32CD32' }]}
                    onPress={() => {
                      if (currentMessage.isPhishing) {
                        Alert.alert('Correct!', 'You identified the phishing email.');
                      } else {
                        Alert.alert('Incorrect!', 'This was a legitimate email.');
                      }
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>PHISHING</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#FF4500' }]}
                    onPress={() => {
                      if (!currentMessage.isPhishing) {
                        Alert.alert('Correct!', 'You identified the legitimate email.');
                      } else {
                        Alert.alert('Incorrect!', 'This was a phishing email.');
                      }
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>NOT</Text>
                  </TouchableOpacity>
                </View>
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
    color: '#FFD700',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
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
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default GameScreen;
