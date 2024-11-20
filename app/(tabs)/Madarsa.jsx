import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Madarsa() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25, letterSpacing: 2, color: "#008080" }}>Madarsa & Kabristan</Text>
      <Text style={{ paddingHorizontal: 20, paddingVertical: 10, textAlign: "center", color: "#404040", letterSpacing: 2 }}>Information regarding the Madarsa and Kabristan can be found here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: "center",
    alignItems: "center"
  },
})