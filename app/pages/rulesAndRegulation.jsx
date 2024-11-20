import { View, Text, StyleSheet } from 'react-native'
import React,{useEffect} from 'react'
import { useNavigation, useRouter } from 'expo-router'
import Header from '../../components/Header';

export default function RulesAndRegulations() {

    const navigation = useNavigation();
    const router = useRouter();
    useEffect(()=>{
        navigation.setOptions({ headerShown: false });

    },[])

  return (
    <View style={styles.container}>
        <Header headerTitle="Rules & Regulations" pushRoute={() => router.replace('/(tabs)/home')} />
      <Text style={{ fontSize: 25, letterSpacing: 2, color: "#008080" }}>Rules & Regulations</Text>
      <Text style={{ paddingHorizontal: 20, paddingVertical: 10, textAlign: "center", color: "#404040", letterSpacing: 2 }}>Information regarding the Madarsa and Kabristan can be found here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: "center",
    alignItems: "center",
    padding:10
  },
})