import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function FingerprintAuth() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    const checkForBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    };

    checkForBiometrics();
  }, []);

  const handleAuthentication = async () => {
    if (!isBiometricSupported) {
      Alert.alert('Biometric authentication is not supported on this device.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      Alert.alert('Authentication successful!');
      router.replace('(tabs)/Home')
    } else {
      Alert.alert('Authentication failed. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Fingerprint Authentication Example</Text>
      <TouchableOpacity onPress={handleAuthentication}>
      <MaterialCommunityIcons name="fingerprint" size={44} color="black" />
      </TouchableOpacity>

    </View>
  );
}