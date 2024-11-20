import { View, StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { getAllCommitteMember, getAllMemberCurrentMonthlyPaymentDetails } from '../api/api';
import * as Speech from 'expo-speech';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PaymentSpeak() {
  const [currentStatus, setCurrentStatus] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentIndex = useRef(0);
  const speechInterval = useRef(null);
  const microphoneAnim = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      const memberData = await getAllCommitteMember();
      const currentMonthPaymentDetails = await getAllMemberCurrentMonthlyPaymentDetails();

      if (currentMonthPaymentDetails) {
        const paymentStatusMap = currentMonthPaymentDetails.reduce((acc, payment) => {
          acc[payment.userID] = { amount: payment.amount, paid: true };
          return acc;
        }, {});

        const finalArray = memberData.map((member) => {
          const paymentStatus = paymentStatusMap[member._id] || { amount: 0, paid: false };
          return {
            username: member.username,
            profileImage: member.profileImage || '',
            paymentStatus: paymentStatus.paid,
            amount: paymentStatus.amount,
          };
        });

        setCurrentStatus(finalArray);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (currentStatus.length > 0 && isSpeaking) {
      speechInterval.current = setInterval(() => {
        if (currentIndex.current < currentStatus.length) {
          const member = currentStatus[currentIndex.current];
          const status = member.paymentStatus
            ? 'ne is mahina ka paisa de diyaa hai!'
            : 'ne is mahina ka paisa nahi diya hai.';
          const speechText = `${member.username} ${status}`;
          setName(member.username)

          Speech.speak(speechText, {
            rate: 0.5,
            pitch: 1,
          });

          currentIndex.current += 1;
        } else {
          clearInterval(speechInterval.current);
          currentIndex.current = 0;
          setIsSpeaking(false);
          Speech.speak("All members have been processed.", { rate: 0.5 }); // Feedback after completion
        }
      }, 7000);
    }

    return () => {
      clearInterval(speechInterval.current);
    };
  }, [currentStatus, isSpeaking]);

  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(microphoneAnim, {
            toValue: 1.5,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(microphoneAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      microphoneAnim.stopAnimation();
      microphoneAnim.setValue(0);
    }
  }, [isSpeaking]);

  const handlePlayStop = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
    } else {
      setIsSpeaking(false);
      Speech.stop();
      clearInterval(speechInterval.current);
      currentIndex.current = 0;
    }
  };

  return (
    <View>
      <View style={styles.speakerBox}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>

          <View style={styles.playButton}>
            <TouchableOpacity onPress={handlePlayStop}>
              <FontAwesome
                name={isSpeaking ? 'stop' : 'microphone'}
                size={24}
                color="#737373"
              />
            </TouchableOpacity>
          </View>

          {isSpeaking && (
            <View style={{ flexDirection: "row", gap: 15, backgroundColor: "rgba(0,0,0,0.04)", alignItems: "center", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 50 }}>
              <Animated.View
                style={[
                  styles.microphoneContainer,
                  {
                    transform: [{ scale: microphoneAnim }], 
                  },
                ]}
              >
                <FontAwesome name="microphone" size={17} color="#737373" />

              </Animated.View>
              <Text style={{ letterSpacing: 2, color: "#737373", fontWeight: "600" }}>{name}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speakerBox: {
    position: 'absolute',
    top: 445,
    right: '2%',
    padding: 10,
    borderRadius: 10,
    zIndex: 10000,
    fontFamily: 'Cairo-SemiBold',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },
  microphoneContainer: {
    width: 34,
    height: 34,
    borderRadius: 50,
    flexDirection: "row",
    backgroundColor: 'rgba(0,0,0,0.)',
    justifyContent: "center",
    alignItems: "center"
  },
});