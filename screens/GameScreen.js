import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Alert, Text, Modal, Button, TextInput, Animated, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Mock data for antivirus scanning
const scanTypes = [
  { id: 'quick', name: 'Quick Scan', duration: 2000, description: 'Scans common threat locations' },
  { id: 'full', name: 'Full Scan', duration: 5000, description: 'Scans entire system' },
  { id: 'custom', name: 'Custom Scan', duration: 3000, description: 'Scan selected locations' }
];

const mockFolders = [
  { id: 'system32', name: 'System32', path: 'C:/Windows/System32' },
  { id: 'programs', name: 'Program Files', path: 'C:/Program Files' },
  { id: 'downloads', name: 'Downloads', path: 'C:/Users/Downloads' },
  { id: 'temp', name: 'Temp', path: 'C:/Windows/Temp' },
  { id: 'startup', name: 'Startup', path: 'C:/Users/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup' },
  { id: 'documents', name: 'Documents', path: 'C:/Users/Documents' }
];

const commonFiles = [
  { id: 1, name: 'setup.exe', type: 'safe', location: 'C:/Downloads', description: 'Legitimate installer' },
  { id: 2, name: 'windows_update.tmp', type: 'safe', location: 'C:/Windows/Temp', description: 'System file' },
  { id: 3, name: 'system_cleaner.exe', type: 'safe', location: 'C:/Program Files', description: 'Legitimate system utility' },
  { id: 4, name: 'document.pdf', type: 'safe', location: 'C:/Documents', description: 'Regular document' },
  { id: 5, name: 'system_driver.sys', type: 'safe', location: 'C:/Windows/System32', description: 'System driver' }
];

// Different sets of threats for different laptop scenarios
const laptopThreatScenarios = [
  // Scenario 1: Gaming laptop with mining malware
  {
    name: 'Gaming Laptop',
    threats: [
      { id: 1, name: 'crypto_miner.exe', type: 'malicious', location: 'C:/Program Files', description: 'Cryptocurrency mining malware' },
      { id: 2, name: 'game_cheat.dll', type: 'malicious', location: 'C:/Program Files', description: 'Suspicious game modification tool' },
      { id: 3, name: 'fake_driver.sys', type: 'malicious', location: 'C:/Windows/System32', description: 'Malicious driver file' }
    ]
  },
  // Scenario 2: Business laptop with data stealer
  {
    name: 'Business Laptop',
    threats: [
      { id: 4, name: 'password_stealer.exe', type: 'malicious', location: 'C:/Temp', description: 'Suspicious file - may steal passwords' },
      { id: 5, name: 'keylogger123.dll', type: 'malicious', location: 'C:/Program Files', description: 'Malicious DLL - may record keystrokes' },
      { id: 6, name: 'data_exfil.exe', type: 'malicious', location: 'C:/Downloads', description: 'Suspicious data transfer program' }
    ]
  },
  // Scenario 3: Student laptop with adware
  {
    name: 'Student Laptop',
    threats: [
      { id: 7, name: 'browser_extension.dll', type: 'malicious', location: 'C:/Program Files', description: 'Suspicious browser extension' },
      { id: 8, name: 'adware_installer.exe', type: 'malicious', location: 'C:/Downloads', description: 'Adware installation program' },
      { id: 9, name: 'fake_antivirus.exe', type: 'malicious', location: 'C:/Program Files', description: 'Malicious software disguised as antivirus' }
    ]
  },
  // Scenario 4: Safe laptop (no threats)
  {
    name: 'Safe Laptop',
    threats: []
  }
];

const fakeAlerts = [
  { id: 1, title: 'System Alert', message: 'Your system is at risk! Click here to fix now!', isMalicious: true },
  { id: 2, title: 'Update Available', message: 'New virus definitions are available. Update now?', isMalicious: false },
  { id: 3, title: 'Security Warning', message: 'Your antivirus is outdated! Click to update!', isMalicious: true },
  { id: 4, title: 'System Optimization', message: 'Your system needs optimization. Click to scan!', isMalicious: true }
];

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
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedElements, setIdentifiedElements] = useState([]);
  const [showElementIdentification, setShowElementIdentification] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [scanningFiles, setScanningFiles] = useState([]);
  const [scanIntervalId, setScanIntervalId] = useState(null);
  const [showFakeAlert, setShowFakeAlert] = useState(false);
  const [currentFakeAlert, setCurrentFakeAlert] = useState(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [showFileIdentification, setShowFileIdentification] = useState(false);
  const [identifiedFiles, setIdentifiedFiles] = useState([]);
  const [currentThreatFiles, setCurrentThreatFiles] = useState({ files: [], threats: [] });
  const [threatMeter, setThreatMeter] = useState(100);
  const [isCriticalWarning, setIsCriticalWarning] = useState(false);
  const [perfectGame, setPerfectGame] = useState(true);
  const [recoveryTimer, setRecoveryTimer] = useState(null);
  const [score, setScore] = useState(0);
  const [threatsNeutralized, setThreatsNeutralized] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [showHighScoreModal, setShowHighScoreModal] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  // Load high score when component mounts
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const savedHighScore = await AsyncStorage.getItem('highScore');
        if (savedHighScore) {
          setHighScore(parseInt(savedHighScore));
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };
    loadHighScore();
  }, []);

  // Save high score when game ends
  const saveHighScore = async (newScore) => {
    try {
      if (newScore > highScore) {
        await AsyncStorage.setItem('highScore', newScore.toString());
        setHighScore(newScore);
        return true;
    }
      return false;
    } catch (error) {
      console.error('Error saving high score:', error);
      return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSpawnedDevices((prevDevices) => {
        const newDevices = [
          ...prevDevices,
          {
            id: Math.random().toString(),
            type: Math.floor(Math.random() * devices.length),
            x: Math.random() * (width - 100),
            y: Math.random() * (height - 100),
            hasThreat: true, // Only spawn devices with threats
            scenarioIndex: Math.floor(Math.random() * laptopThreatScenarios.length), // Assign random scenario to laptop
          },
        ];

        // Check for too many simultaneous devices
        if (newDevices.length >= 50) {
          handleMistake('minor'); // Apply a minor penalty
          // Remove oldest device to maintain performance
          return newDevices.slice(1);
        }

        return newDevices;
      });
    }, difficulty === 'easy' ? 7000 : difficulty === 'medium' ? 5000 : 3000);

    return () => clearInterval(interval);
  }, [difficulty]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetStates = () => {
    setScanProgress(0);
    setScanningFiles([]);
    setShowFileIdentification(false);
    setIdentifiedFiles([]);
    setCurrentThreatFiles({ files: [], threats: [] });
    setNeedsUpdate(false);
    setIsUpdating(false);
    setUpdateProgress(0);
    setModalVisible(false);
    setCurrentMessage(null);
  };

  const handleDeviceClick = (device) => {
    if (device.hasThreat) {
      // Reset all states before starting new interaction
      setScanProgress(0);
      setScanningFiles([]);
      setShowFileIdentification(false);
      setIdentifiedFiles([]);
      setCurrentThreatFiles({ files: [], threats: [] });
      setNeedsUpdate(false);
      setIsUpdating(false);
      setUpdateProgress(0);
      setModalVisible(false);
      setCurrentMessage(null);
      setShowElementIdentification(false);
      setIdentifiedElements([]);
      setHighlightedWord(null);

      switch (device.type) {
        case 0: // Laptop
          setCurrentMessage({
            title: 'Antivirus',
            body: 'Checking for updates...',
            device,
            type: 'update_check'
          });
          setModalVisible(true);
          
          setTimeout(() => {
            setCurrentMessage({
              title: 'Antivirus',
              body: 'Updates available. Would you like to update now?',
              device,
              type: 'update_prompt'
            });
          }, 1500);
          break;

        case 1: // Phone
          const isPhishing = Math.random() < 0.7; // 70% chance for phishing
          const messages = isPhishing ? phishingMessages : legitMessages;
          const randomIndex = Math.floor(Math.random() * messages.length);
          setCurrentMessage({ ...messages[randomIndex], device });
          setModalVisible(true);
          break;

        case 2: // Modem
          setCurrentMessage({
            title: 'Change Wi-Fi Password',
            body: 'Enter and confirm a new password to secure your modem.',
            device,
          });
          setModalVisible(true);
          break;

        default:
          Alert.alert('No threat detected on this device.');
          break;
      }
    }
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(0);

    const updateInterval = setInterval(() => {
      setUpdateProgress(prev => {
        const newProgress = prev + 0.05;
        if (newProgress >= 1) {
          clearInterval(updateInterval);
          setIsUpdating(false);
          handleThreatNeutralized('update');
          Alert.alert(
            'Update Complete',
            'Antivirus has been successfully updated to the latest version.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setCurrentMessage({
                    title: 'Antivirus',
                    body: 'Scanning for threats...',
                    device: currentMessage.device,
                    type: 'scan'
                  });
                  startScanningProcess(currentMessage.device);
                }
              }
            ]
          );
        }
        return newProgress;
      });
    }, 200);
  };

  const calculatePoints = (action, isCorrect) => {
    let points = 0;
    switch (action) {
      case 'threat_identified':
        points = isCorrect ? 200 : -100; // Increased points
        break;
      case 'phishing_identified':
        points = isCorrect ? 300 : -150; // Increased points
        break;
      case 'password_secured':
        points = isCorrect ? 400 : -200; // Increased points
        break;
      case 'update_installed':
        points = isCorrect ? 100 : -50; // Increased points
        break;
    }
    return points;
  };

  const handleFileIdentification = (file, action) => {
    const isAlreadyIdentified = identifiedFiles.some(f => f.id === file.id);
    
    if (!isAlreadyIdentified) {
      const isCorrect = (currentThreatFiles.threats.some(t => t.id === file.id) && action === 'remove') ||
                       (!currentThreatFiles.threats.some(t => t.id === file.id) && action === 'ignore');
      
      const points = calculatePoints('threat_identified', isCorrect);
      setScore(prev => prev + points);
      if (!isCorrect) setMistakes(prev => prev + 1);
      
      setIdentifiedFiles(prevFiles => {
        const updatedFiles = [...prevFiles, { ...file, action }];
        
        if (updatedFiles.length === currentThreatFiles.files.length) {
          const correctIdentifications = updatedFiles.filter(f => {
            const isThreat = currentThreatFiles.threats.some(t => t.id === f.id);
            return (isThreat && f.action === 'remove') || (!isThreat && f.action === 'ignore');
          }).length;

          const totalFiles = currentThreatFiles.files.length;
          const accuracy = Math.round((correctIdentifications / totalFiles) * 100);
          
          if (accuracy >= 80) {
            setThreatsNeutralized(prev => prev + 1);
          }
          
          // Check win/lose conditions
          checkGameStatus();
          
          setTimeout(() => {
            setShowFileIdentification(false);
            setIdentifiedFiles([]);
            setCurrentThreatFiles({ files: [], threats: [] });
            setScanProgress(0);
            setScanningFiles([]);
            setShowElementIdentification(false);
            setHighlightedWord(null);
            
            handleModalClose(
              currentMessage.device,
              true,
              `Scan completed!\nCorrectly identified ${correctIdentifications} out of ${totalFiles} files (${accuracy}% accuracy).\nPoints earned: ${points}`
            );
          }, 500);
        }
        return updatedFiles;
      });
    }
  };

  const handleModalClose = (device, success, message) => {
    // Reset all states when closing modal
    setModalVisible(false);
    setShowElementIdentification(false);
    setIdentifiedElements([]);
    setIdentifiedFiles([]);
    setCurrentThreatFiles({ files: [], threats: [] });
    setScanProgress(0);
    setScanningFiles([]);
    setShowFileIdentification(false);
    setHighlightedWord(null);

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

  const checkIdentifiedElements = () => {
    if (!currentMessage?.phishingElements) return false;
    
    const allElementsIdentified = currentMessage.phishingElements.every(element =>
      identifiedElements.some(identified => identified.text === element.text)
    );

    if (allElementsIdentified) {
      handleThreatNeutralized('phishing');
      handleModalClose(currentMessage.device, true, 'Great job! You identified all suspicious elements!');
    } else {
      handleMistake('moderate');
      Alert.alert(
        'Security Breach!',
        'Missed phishing elements! Security compromised!',
        [{ text: 'OK' }]
      );
    }
  };

  const handleWordClick = (word, index) => {
    if (!showElementIdentification) return;

    const cleanWord = word.replace(/[.,!?]$/g, '');
    
    // First check if the clicked word is part of the email address
    if (currentMessage.email.toLowerCase().includes(cleanWord.toLowerCase())) {
      const emailElement = currentMessage.phishingElements?.find(e => 
        e.text.toLowerCase() === currentMessage.email.toLowerCase()
      );
      if (emailElement && !identifiedElements.some(e => e.text === emailElement.text)) {
        setIdentifiedElements([...identifiedElements, emailElement]);
        return;
      }
    }

    // Then check for other phishing elements
    const phishingElement = currentMessage.phishingElements?.find(
      element => {
        // Check for exact match
        if (element.text.toLowerCase() === cleanWord.toLowerCase()) {
          return true;
        }
        
        // Check if the word is part of a longer phrase
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

    if (phishingElement) {
      if (!identifiedElements.some(e => e.text === phishingElement.text)) {
        setIdentifiedElements([...identifiedElements, phishingElement]);
      }
    }
  };

  const startScan = (device) => {
    // Always show warning when scanning without update
    Alert.alert(
      'Warning',
      'Scanning without updating may miss new threats. Are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Continue',
          onPress: () => {
            setCurrentMessage({
              title: 'Antivirus',
              body: 'Scanning for threats...',
              device,
              type: 'scan'
            });
            startScanningProcess(device);
          }
        }
      ]
    );
  };

  const startScanningProcess = (device) => {
    // Reset all states before starting new scan
    setScanningFiles([]);
    setScanProgress(0);
    setIdentifiedFiles([]);
    setShowFileIdentification(false);
    setCurrentThreatFiles({ files: [], threats: [] });

    // Determine if laptop is safe or unsafe
    const isSafe = Math.random() < 0.3; // 30% chance of being safe
    const scenario = laptopThreatScenarios[Math.floor(Math.random() * laptopThreatScenarios.length)];
    
    // Create a mixed list of safe and unsafe files
    const mixedFiles = [
      ...scenario.threats,
      ...commonFiles.slice(0, 3) // Add some safe files
    ].sort(() => Math.random() - 0.5); // Randomize the order

    // Update scanning files display
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 0.02; // Increment by 2% each time
        if (newProgress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            if (isSafe) {
              handleModalClose(device, true, 'Scan completed! No threats found. This laptop is safe.');
            } else {
              // Store both the files and the scenario information
              setCurrentThreatFiles({
                files: mixedFiles,
                threats: scenario.threats
              });
              setShowFileIdentification(true);
              setCurrentMessage({
                title: 'Antivirus',
                body: 'Files scanned. Please identify which files are safe and which are threats.',
                device,
                type: 'file_identification'
              });
            }
          }, 500);
        }
        return newProgress;
      });

      setScanningFiles(prev => {
        const newFiles = [...prev];
        if (newFiles.length > 5) newFiles.shift();
        const randomFolder = mockFolders[Math.floor(Math.random() * mockFolders.length)];
        newFiles.push(`Scanning ${randomFolder.path}...`);
        return newFiles;
      });
    }, 140);
  };

  const updateThreatMeter = (change, isRecovery = false) => {
    setThreatMeter(prev => {
      const newValue = Math.max(0, Math.min(100, prev + change));
      
      // Handle critical warning
      if (newValue < 50 && !isCriticalWarning) {
        setIsCriticalWarning(true);
        // Flash warning for 2 seconds
        setTimeout(() => setIsCriticalWarning(false), 2000);
      }
      
      // Handle perfect game status
      if (newValue < 100) {
        setPerfectGame(false);
      }
      
      // Handle recovery bonus
      if (isRecovery && newValue >= 70) {
        const recoveryBonus = Math.floor((newValue - 70) / 5) * 50; // Bonus points for recovery
        setScore(prev => prev + recoveryBonus);
      }
      
      return newValue;
    });
  };

  const handleMistake = (severity) => {
    let meterLoss;
    switch (severity) {
      case 'critical': // Major security breach
        meterLoss = -30;
        break;
      case 'moderate': // Moderate security risk
        meterLoss = -15;
        break;
      case 'minor': // Minor security issue
        meterLoss = -5;
        break;
      default:
        meterLoss = -10;
    }
    
    updateThreatMeter(meterLoss);
    
    // Start recovery timer
    if (recoveryTimer) clearTimeout(recoveryTimer);
    const timer = setTimeout(() => {
      // If player hasn't fixed the issue within 10 seconds, additional penalty
      updateThreatMeter(-5);
    }, 10000);
    setRecoveryTimer(timer);
  };

  const handleThreatNeutralized = (threatType) => {
    let meterGain;
    switch (threatType) {
      case 'malware':
        meterGain = 25;
        break;
      case 'phishing':
        meterGain = 20;
        break;
      case 'password':
        meterGain = 15;
        break;
      case 'update':
        meterGain = 10;
        break;
      default:
        meterGain = 10;
    }
    
    updateThreatMeter(meterGain, true);
    
    // Check for perfect game bonus
    if (perfectGame && threatMeter === 100) {
      const perfectBonus = 2000; // Increased from 1000 to 2000
      setScore(prev => prev + perfectBonus);
      Alert.alert(
        '🌟 Perfect Security! 🌟',
        `You've maintained perfect security!\n
        +${perfectBonus} bonus points!`,
        [{ text: 'Awesome!' }]
      );
    }
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      // Strong password - gain security
      handleThreatNeutralized('password');
      handleModalClose(currentMessage.device, true, 'Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordAttempts(0); // Reset attempts on success
    } else {
      // Weak password - lose security
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        // Game over after 3 failed attempts
        handleMistake('critical');
        Alert.alert(
          '⚠️ Security Breach! ⚠️',
          'Too many failed password attempts! The system has been compromised!\n\n' +
          'Points Lost: -500\n' +
          'Security Status: Critical',
          [{ 
            text: 'Continue', 
            onPress: () => {
              setScore(prev => prev - 500);
              handleModalClose(currentMessage.device, false, 'Security compromised due to multiple failed attempts!');
              setPasswordAttempts(0);
            }
          }]
        );
      } else {
        handleMistake('moderate');
        Alert.alert(
          '⚠️ Security Warning! ⚠️',
          `Weak password detected! Security compromised!\n\n` +
          `Attempts remaining: ${3 - newAttempts}\n` +
          'Please use a stronger password (minimum 8 characters)',
          [{ text: 'Try Again' }]
        );
      }
    }
  };

  const checkGameStatus = () => {
    // Win conditions
    if (threatsNeutralized >= 10 && score >= 2000) { // Changed from 5 to 10 threats
      setGameOver(true);
      const isNewHighScore = saveHighScore(score);
      setShowHighScoreModal(true);
      Alert.alert(
        '🎉 Victory! 🎉',
        `Congratulations! You've successfully defended the grid!\n\n
        Final Score: ${score}\n
        Threats Neutralized: ${threatsNeutralized}/10\n
        Mistakes Made: ${mistakes}/10\n
        Time Elapsed: ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}\n\n
        ${isNewHighScore ? '🏆 NEW HIGH SCORE! 🏆' : ''}`,
        [{ text: 'Play Again', onPress: () => resetGame() }]
      );
    }
    
    // Lose conditions
    if (mistakes >= 10 || score < 0) { // Changed from 5 to 10 mistakes
      setGameOver(true);
      Alert.alert(
        'Game Over',
        `The grid has been compromised!\n\n
        Final Score: ${score}\n
        Threats Neutralized: ${threatsNeutralized}/10\n
        Mistakes Made: ${mistakes}/10\n
        Time Elapsed: ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}`,
        [{ text: 'Try Again', onPress: () => resetGame() }]
      );
    }
  };

  const resetGame = () => {
    setScore(0);
    setThreatsNeutralized(0);
    setMistakes(0);
    setGameTime(0);
    setGameOver(false);
    setSpawnedDevices([]);
  };

  return (
    <ImageBackground source={require('../assets/game_background.png')} style={styles.background}>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreContent}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>Threats: {threatsNeutralized}/10</Text>
          <Text style={styles.scoreText}>Mistakes: {mistakes}/10</Text>
          <Text style={styles.scoreText}>Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</Text>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
        </View>
      </View>
      <View style={styles.threatMeterContainer}>
        <View style={styles.threatMeter}>
          <View 
            style={[
              styles.threatMeterFill,
              { 
                width: `${threatMeter}%`,
                backgroundColor: threatMeter >= 70 ? '#4CD964' : 
                               threatMeter >= 40 ? '#FFD700' : 
                               '#FF3B30'
              }
            ]} 
          />
        </View>
        <Text style={styles.threatMeterText}>
          Security Status: {threatMeter}%
        </Text>
        {isCriticalWarning && (
          <View style={styles.criticalWarning}>
            <Text style={styles.criticalWarningText}>CRITICAL WARNING!</Text>
          </View>
        )}
      </View>
      <View style={styles.gameArea}>
        {spawnedDevices.map((device) => (
          <TouchableOpacity key={device.id} onPress={() => handleDeviceClick(device)}>
            <Image
              source={devices[device.type].threat}
              style={[styles.device, { top: device.y, left: device.x }]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {currentMessage && (
            <>
              <ScrollView contentContainerStyle={styles.modalScrollContent} style={{width: '100%'}}>
                {currentMessage.type === 'update_check' ? (
                  <View style={styles.phoneFrame}>
                    <View style={styles.phoneHeader}>
                      <Text style={styles.headerText}>Checking for Updates</Text>
                    </View>
                    <View style={styles.scanningContainer}>
                      <Text style={styles.scanningTitle}>Checking antivirus database...</Text>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progress, { width: '100%' }]} />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : currentMessage.type === 'update_prompt' ? (
                  <View style={styles.phoneFrame}>
                    <View style={styles.phoneHeader}>
                      <Text style={styles.headerText}>Update Available</Text>
                    </View>
                    <View style={styles.scanningContainer}>
                      <Text style={styles.scanningTitle}>New virus definitions available</Text>
                      {isUpdating ? (
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBar}>
                            <View style={[styles.progress, { width: `${updateProgress * 100}%` }]} />
                          </View>
                          <Text style={styles.progressText}>
                            {Math.round(updateProgress * 100)}%
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#4CD964' }]}
                            onPress={handleUpdate}
                          >
                            <Text style={styles.buttonText}>UPDATE NOW</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                            onPress={() => startScan(currentMessage.device)}
                          >
                            <Text style={styles.buttonText}>SCAN WITHOUT UPDATE</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                ) : currentMessage.type === 'file_identification' ? (
                  <View style={styles.phoneFrame}>
                    <View style={styles.phoneHeader}>
                      <Text style={styles.headerText}>Threat Detection</Text>
                    </View>
                    <View style={styles.scanningContainer}>
                      <Text style={styles.scanningTitle}>Suspicious Files Found</Text>
                      <ScrollView style={styles.threatFilesList}>
                        {currentThreatFiles.files.map((file, index) => {
                          const fileIdentification = identifiedFiles.find(f => f.id === file.id);
                          const isIdentified = !!fileIdentification;
                          
                          return (
                            <View key={index} style={styles.threatFileItem}>
                              <View style={styles.threatFileInfo}>
                                <Text style={styles.threatFileName}>{file.name}</Text>
                                <Text style={styles.threatFileLocation}>{file.location}</Text>
                                <Text style={styles.threatFileDescription}>{file.description}</Text>
                              </View>
                              {!isIdentified ? (
                                <View style={styles.threatFileActions}>
                                  <TouchableOpacity
                                    style={[styles.threatFileButton, { backgroundColor: '#4CD964' }]}
                                    onPress={() => handleFileIdentification(file, 'ignore')}
                                  >
                                    <Text style={styles.buttonText}>SAFE</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.threatFileButton, { backgroundColor: '#FF3B30' }]}
                                    onPress={() => handleFileIdentification(file, 'remove')}
                                  >
                                    <Text style={styles.buttonText}>THREAT</Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View style={styles.threatFileStatus}>
                                  <Text style={[
                                    styles.threatFileStatusText,
                                    { color: fileIdentification.action === 'remove' ? '#FF3B30' : '#4CD964' }
                                  ]}>
                                    {fileIdentification.action === 'remove' ? 'MARKED AS THREAT' : 'MARKED AS SAFE'}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                ) : currentMessage.type === 'scan' ? (
                  <View style={styles.phoneFrame}>
                    <View style={styles.phoneHeader}>
                      <Text style={styles.headerText}>Antivirus Scanner</Text>
                    </View>
                    <View style={styles.scanningContainer}>
                      <Text style={styles.scanningTitle}>Scanning in Progress</Text>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progress, { width: `${scanProgress * 100}%` }]} />
                        </View>
                        <Text style={styles.progressText}>
                          {Math.round(scanProgress * 100)}%
                        </Text>
                      </View>
                      <Text style={styles.scanningStatus}>
                        Files scanned: {Math.round(scanProgress * 1000)}
                      </Text>
                      {scanningFiles.length > 0 && (
                        <ScrollView style={styles.scanningFilesList}>
                          {scanningFiles.map((file, index) => (
                            <Text key={index} style={styles.scanningFile}>{file}</Text>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </View>
                ) : currentMessage.title === 'Change Wi-Fi Password' ? (
                  <View style={styles.phoneFrame}>
                    <View style={styles.phoneHeader}>
                      <Text style={styles.headerText}>Wi-Fi Security</Text>
                    </View>
                    <View style={styles.passwordContainer}>
                      <Text style={styles.passwordAttemptsText}>
                        Attempts remaining: {3 - passwordAttempts}
                      </Text>
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
                        style={[
                          styles.actionButton, 
                          { 
                            backgroundColor: '#4CD964',
                            opacity: passwordAttempts >= 3 ? 0.5 : 1
                          }
                        ]}
                        onPress={handlePasswordChange}
                        disabled={passwordAttempts >= 3}
                      >
                        <Text style={styles.buttonText}>Change Password</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.phoneFrame}>
                      <View style={styles.phoneHeader}>
                        <Text style={styles.headerText}>Email</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => {
                          if (currentMessage.isPhishing) {
                            const emailElement = currentMessage.phishingElements?.find(e => 
                              e.text.toLowerCase() === currentMessage.email.toLowerCase()
                            );
                            if (emailElement && !identifiedElements.some(e => e.text === emailElement.text)) {
                              setIdentifiedElements([...identifiedElements, emailElement]);
                            }
                          }
                        }}
                      >
                        <Text style={[
                          styles.emailText,
                          currentMessage.isPhishing && styles.clickableText,
                          identifiedElements.some(e => e.text.toLowerCase() === currentMessage.email.toLowerCase()) && styles.wordIdentifiedText
                        ]}>
                          {currentMessage.email}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.messageContainer}>
                        {currentMessage.body.split(' ').map((word, index) => {
                          const cleanWord = word.replace(/[.,!?]$/g, '');
                          const isHighlighted = highlightedWord === cleanWord;
                          const isIdentified = identifiedElements.some(e => {
                            if (e.text.toLowerCase() === cleanWord.toLowerCase()) {
                              return true;
                            }
                            if (currentMessage.body.toLowerCase().includes(e.text.toLowerCase())) {
                              const phrase = e.text.toLowerCase();
                              const startIndex = currentMessage.body.toLowerCase().indexOf(phrase);
                              const endIndex = startIndex + phrase.length;
                              const currentWordStart = currentMessage.body.toLowerCase().indexOf(cleanWord.toLowerCase());
                              return currentWordStart >= startIndex && currentWordStart < endIndex;
                            }
                            return false;
                          });
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => handleWordClick(word, index)}
                              style={[
                                styles.wordWrapper,
                                isHighlighted && styles.wordHighlighted,
                                isIdentified && styles.wordIdentified
                              ]}
                            >
                              <Text style={[
                                styles.messageText,
                                isHighlighted && styles.wordHighlightedText,
                                isIdentified && styles.wordIdentifiedText
                              ]}>
                                {word}{' '}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                    {showElementIdentification && (
                      <View style={styles.elementIdentificationContainer}>
                        <Text style={styles.elementIdentificationTitle}>
                          Find all suspicious elements in the email
                        </Text>
                        <ScrollView 
                          style={styles.identifiedElementsScroll}
                          contentContainerStyle={styles.identifiedElementsContent}
                        >
                          {currentMessage.phishingElements.map((element, index) => {
                            const isIdentified = identifiedElements.some(e => e.text === element.text);
                            return (
                              <View 
                                key={index} 
                                style={[
                                  styles.identifiedElement,
                                  isIdentified && styles.identifiedElementHighlighted
                                ]}
                              >
                                <Text style={[
                                  styles.identifiedElementText,
                                  isIdentified && styles.identifiedElementTextHighlighted
                                ]}>
                                  {isIdentified ? element.text : '?'}
                                </Text>
                                <Text style={styles.identifiedElementReason}>
                                  {isIdentified ? element.reason : 'Find this element'}
                                </Text>
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                    )}
                    <View style={styles.buttonContainerSticky}>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#4CD964' }]}
                        onPress={() => {
                          if (currentMessage.isPhishing) {
                            if (!showElementIdentification) {
                              setShowElementIdentification(true);
                            } else {
                              checkIdentifiedElements();
                            }
                          } else {
                            handleMistake('moderate');
                            handleModalClose(currentMessage.device, false, 
                              'Incorrect! This was a legitimate message.');
                          }
                        }}
                      >
                        <Text style={styles.buttonText}>
                          {showElementIdentification ? 'SUBMIT IDENTIFIED ELEMENTS' : 'PHISHING'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                        onPress={() => {
                          if (!currentMessage.isPhishing) {
                            handleModalClose(currentMessage.device, true, 
                              'Correct! This was a legitimate message.');
                          } else {
                            handleMistake('moderate');
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
              </ScrollView>
            </>
          )}
        </View>
      </Modal>

      {/* Fake Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFakeAlert}
        onRequestClose={() => setShowFakeAlert(false)}
      >
        <View style={styles.alertModalContainer}>
          <View style={styles.alertModalContent}>
            <Text style={styles.alertTitle}>{currentFakeAlert?.title}</Text>
            <Text style={styles.alertMessage}>{currentFakeAlert?.message}</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={[styles.alertButton, { backgroundColor: '#4CD964' }]}
                onPress={() => handleFakeAlertResponse(true)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, { backgroundColor: '#FF3B30' }]}
                onPress={() => handleFakeAlertResponse(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    width: width * 0.25,
    height: width * 0.25,
    position: 'absolute',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: width * 0.01,
    marginTop: height * 0.1,
  },
  modalScrollContent: {
    alignItems: 'center',
    paddingBottom: height * 0.15,
    justifyContent: 'center',
  },
  phoneFrame: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    maxHeight: height * 0.5,
    marginTop: height * 0.05,
  },
  phoneHeader: {
    backgroundColor: '#f2f2f2',
    padding: width * 0.03,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.01,
    padding: width * 0.02,
  },
  clickableText: {
    textDecorationLine: 'underline',
    color: '#0066cc',
  },
  messageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: width * 0.03,
    maxHeight: height * 0.35,
    alignItems: 'flex-start',
  },
  wordWrapper: {
    marginRight: 2,
    padding: 4,
    borderRadius: 4,
    minWidth: width * 0.05,
  },
  wordHighlighted: {
    backgroundColor: '#90EE90',
    transform: [{ scale: 1.1 }],
  },
  wordIdentified: {
    backgroundColor: '#90EE90',
  },
  wordHighlightedText: {
    color: '#000',
    fontWeight: 'bold',
  },
  wordIdentifiedText: {
    color: '#006400',
    fontWeight: 'bold',
    backgroundColor: '#90EE90',
    borderRadius: 4,
  },
  messageText: {
    fontSize: width * 0.035,
    color: '#000',
    lineHeight: width * 0.05,
  },
  buttonContainerSticky: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    position: 'absolute',
    bottom: height * 0.02,
    left: '2.5%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  actionButton: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
    marginHorizontal: width * 0.01,
    minWidth: width * 0.35,
    maxWidth: width * 0.45,
  },
  buttonText: {
    fontSize: width * 0.032,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  elementIdentificationContainer: {
    width: '95%',
    padding: width * 0.02,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginTop: height * 0.01,
    maxHeight: height * 0.25,
  },
  elementIdentificationTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
    textAlign: 'center',
  },
  identifiedElementsScroll: {
    maxHeight: height * 0.2,
    width: '100%',
  },
  identifiedElementsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: width * 0.01,
    paddingBottom: height * 0.01,
  },
  identifiedElement: {
    backgroundColor: '#fff',
    padding: width * 0.02,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '48%',
    minWidth: width * 0.35,
    maxWidth: width * 0.45,
  },
  identifiedElementHighlighted: {
    backgroundColor: '#90EE90',
    borderColor: '#006400',
  },
  identifiedElementText: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  identifiedElementTextHighlighted: {
    color: '#006400',
  },
  identifiedElementReason: {
    fontSize: width * 0.025,
    color: '#666',
  },
  scanningContainer: {
    padding: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
  },
  scanningFilesList: {
    maxHeight: height * 0.3,
    width: '100%',
    marginTop: 15,
  },
  scanningFile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  passwordContainer: {
    padding: width * 0.04,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: height * 0.05,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.01,
    fontSize: width * 0.035,
  },
  scanningStatus: {
    fontSize: width * 0.035,
    color: '#333',
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  alertModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  alertModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: width * 0.05,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.03,
    textAlign: 'center',
    lineHeight: width * 0.06,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: height * 0.02,
  },
  alertButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 10,
    minWidth: width * 0.25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  threatFilesList: {
    maxHeight: height * 0.4,
    width: '100%',
    marginTop: 15,
  },
  threatFileItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  threatFileInfo: {
    marginBottom: 10,
  },
  threatFileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  threatFileLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  threatFileDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  threatFileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  threatFileButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  threatFileStatus: {
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  threatFileStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  threatMeterContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  threatMeter: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  threatMeterFill: {
    height: '100%',
    transition: 'width 0.3s ease-in-out',
  },
  threatMeterText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  criticalWarning: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    padding: 10,
    borderRadius: 5,
    animation: 'flash 1s infinite',
  },
  criticalWarningText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  securityIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1001,
  },
  securityIndicatorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    zIndex: 1000,
    maxWidth: width * 0.3,
  },
  scoreContent: {
    alignItems: 'flex-start',
  },
  scoreText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: 'bold',
  },
  highScoreText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    marginTop: height * 0.15, // Add space for the score and threat meter
    marginBottom: height * 0.1, // Add space at the bottom
    position: 'relative',
  },
  passwordAttemptsText: {
    fontSize: width * 0.035,
    color: '#FF3B30',
    marginBottom: height * 0.01,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;
