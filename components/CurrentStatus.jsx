import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllCommitteMember, getAllMemberCurrentMonthlyPaymentDetails } from '../api/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function CurrentStatus() {
  const [currentStatus, setCurrentStatus] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const memberData = await getAllCommitteMember();
      const currentMonthPaymentDetails = await getAllMemberCurrentMonthlyPaymentDetails();

      if (currentMonthPaymentDetails) {
        const paymentStatusMap = currentMonthPaymentDetails.reduce((acc, payment) => {
          acc[payment.userID] = { amount: payment.amount, paid: true };
          return acc;
        }, {});

        const finalArray = memberData.map(member => {
          const paymentStatus = paymentStatusMap[member._id] || { amount: 0, paid: false };
          return {
            username: member.username,
            profilePic: member.profilePic || "",
            paymentStatus: paymentStatus.paid,
            amount: paymentStatus.amount,
          };
        });

        setCurrentStatus(finalArray);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (currentStatus.length > 0) {
        intervalRef.current = setInterval(() => {
          nextSlide();
        }, 3000);
      }

      return () => {
        clearInterval(intervalRef.current);
      };
    }, [currentStatus, currentIndex])
  );

  const nextSlide = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentStatus.length);
      slideAnim.setValue(300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  if (loading || currentStatus.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.3)", height: 70, borderRadius: 10 }}></Text>
      </View>
    );
  }

  const currentItem = currentStatus[currentIndex];
  console.log(currentItem?.profilePic); // This will now only log when the component is focused

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={[styles.slideContainer, { transform: [{ translateX: slideAnim }] }]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.01)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.item}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {currentItem.profilePic ? (
                <View style={styles.imageContainer}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 100, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", borderStyle: "dashed", backgroundColor: "rgba(255,255,255,0.6)" }}
                    source={{ uri: currentItem.profilePic }} />
                </View>
              ) : (
                <View style={styles.imageContainer}>
                  <FontAwesome name="user-circle" size={45} color="#008080" />
                </View>
              )}
              <Text style={styles.text}>{currentItem.username}</Text>
            </View>
            <Text style={styles.status}>
              {currentItem.paymentStatus ? <Text style={{ color: "#008080", letterSpacing: 1 }}>Paid</Text> : "Not Paid"}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  card: {
    marginTop: 8,
  },
  slideContainer: {
    width: '100%',
    position: 'relative',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: 'dashed',
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 30,
  
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#737373",
    letterSpacing: 1
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
  },
});
