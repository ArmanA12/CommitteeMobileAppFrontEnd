import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function DuePayment() {
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' }}>
      <AntDesign name="warning" size={44} color="#008080" style={{ marginVertical: 10 }} />
      <Text style={{ color: "#737373" }}>No Data Available Here</Text>
    </View>
  );
}
