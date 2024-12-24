import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter} from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function Header({ headerTitle, pushRoute }) {
  const router = useRouter();
  const handleBack = () => {
    if (pushRoute) {
      console.log(pushRoute, "push route")
      router.push(pushRoute);
    } else {
      try {
        console.log("back called")
        router.push(pushRoute);
      } catch (error) {
        console.warn("GO_BACK not handled, navigating to default screen.");
        router.push(pushRoute);
      }
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}><AntDesign name="arrowleft" size={24} color="black" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: "105%",
    paddingTop: 30,
    paddingBottom: 8,
    paddingHorizontal: 13,
    backgroundColor: '#f2f2f2',
    position: "absolute",
    top:6,
    zIndex: 1000000
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {

    marginRight: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    letterSpacing:2
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});