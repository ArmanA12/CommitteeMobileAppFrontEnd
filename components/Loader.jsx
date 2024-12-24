import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react'

export default function Loader() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#f2f2f2" />
      <Text style={styles.loadingText}>Submiting...</Text>
    </View>

  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#f2f2f2',
    marginLeft: 10,
  },
})