import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllCommitteMember, 
  getAllMemberCurrentMonthlyPaymentDetails,
   getCurrentMonthYear,
   handleMemberDelete } from '../../api/api'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation, useRouter } from 'expo-router';
import Header from '../../components/Header';

export default function CurrentStatus() {
  const navigation = useNavigation();
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('');
  const [showHide, setShowHide] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userIdForDelete, setuserIdForDelete] = useState('');
  const password = "1234"

  const refArray = [];

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const fetchMembers = async () => {
      const { currentMonth } = getCurrentMonthYear();
      setMonth(currentMonth)
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
            _id: member._id,
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

  const handleDelete = (userId) => {
    setuserIdForDelete(userId);
    showAdminPopup();
    setCurrentStatus(currentStatus.filter(item => item._id !== userId));
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      refArray[index + 1].focus();
    }
  };

  const handleFinalMemberDelete = async (id) => {
    try {
      const res = await handleMemberDelete(id);   
      if (res && res.data) {
        Alert.alert("Success", res.data.message);  
        setShowHide(false)
      }
    } catch (error) {
      Alert.alert("Warning", "Not able to Delete Member");
      setShowHide(false)
    }
  };


  const finalSubmit = () => {
    const otpCode = otp.join('');
    if (password === otpCode) {
      handleFinalMemberDelete(userIdForDelete)
    }
    else {
      Alert.alert("Wrong Password", "Please enter the correct password")
    }
  }

  const showAdminPopup = () => {
    setShowHide(true);
  }

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  }

  const renderItem = ({ item }) => (
    <LinearGradient
      colors={['#f3f3f3', '#f3f3f3', '#f3f3f3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.item}>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {item.profilePic ? (
          <View style={styles.imageContainer}>
            <Image
            style={{ width: 50, height: 50, borderRadius: 100 , objectFit:"fill", padding:4, borderWidth:3, borderColor:"rgba(0,0,0,0.03)", borderStyle:"dashed", backgroundColor:"rgba(255,255,255,0.6)"}}
            source={{ uri: item?.profilePic }}  />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <FontAwesome name="user-circle" size={45} color="#008080" />
          </View>
        )}
        <Text style={styles.text}>{item.username}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.status}>
          {item.paymentStatus ? <Text style={{ color: "#008080", letterSpacing: 1 }}>Paid</Text> : <Text style={{letterSpacing:1}}>Not Paid</Text>}
        </Text>
        <TouchableOpacity onPress={() => toggleMenu(item._id)}>
          <View style={styles.menuContainer}>
            <Text style={styles.delete}>...</Text>
            {openMenuId === item._id && (
              <View style={styles.viewDelete}>
                <TouchableOpacity onPress={() => router.push(`/pages/memberProfile/${item._id}`)}>
                  <View style={styles.editDelete}>
                    <FontAwesome name="eye" size={20} color="#008080" />
                    <Text style={styles.editDeleteText}>View Profile</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{borderTopWidth:1, borderTopColor:"rgba(0,0,0,0.3)", borderStyle:"dashed"}} onPress={() => handleDelete(item._id)}>
                  <View style={styles.editDelete}>
                    <FontAwesome name="trash-o" size={18} color="red" />
                    <Text style={styles.editDeleteText}>Delete</Text>
                  </View>
                </TouchableOpacity>
                
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );


  const array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

  if (loading || currentStatus.length === 0) {
    return (
        array.map((item, index) => {
            return (
                <View key={index} style={{ flex: 1, alignItems: "center", paddingTop: 70 }}>
                    <View style={{
                        height: 60,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.06)",
                        borderRadius: 10,
                        borderStyle: "dashed",
                        width: "90%"
                    }}>
                    </View>
                </View>
            );
        })
    );
}

  return (
    <View style={styles.container}>
      <Header headerTitle="Current Payment Status" pushRoute='/pages/allMemberMonthlyPaymentDetails' />
      {showHide && (
        <View style={styles.popupMain}>
          <View style={styles.adminPopup}>
            <Text style={{ fontSize: 23, textAlign: "center", color: "#008080", fontWeight: "bold", marginBottom: 5 }}>Password</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>If You are Admin Then Please Add Password</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  ref={(input) => refArray[index] = input}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
              <TouchableOpacity onPress={() => setShowHide(false)}>
                <Text style={{ fontWeight: "bold", color: "red", paddingHorizontal: 20, paddingVertical: 8, }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => finalSubmit()} disabled={loading}>
                {loading ? <Loader /> : <Text style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "rgba(0,0,0,0.09)", borderRadius: 50 }}>Proceed</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={{ marginTop: 100, marginBottom: 20 }}>
        <Text style={{ letterSpacing: 2, fontSize: 20, textAlign: "center", color: "#404040" }}>
          {month} Payment Status
        </Text>
      </View>

      <FlatList
        data={currentStatus}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 7,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
    borderStyle: 'dashed',
  },
  imageContainer: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
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
    color: '#bf4040',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  adminPopup: {
    position: "absolute",
    top: "40%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  otpInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'black',
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  popupMain: {
    position: "absolute",
    top: 1,
    width: "110%",
    height: "110%",
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row", 
    justifyContent: "center",
    alignItems:"center",
    zIndex:19999999
  },
  menuContainer: {
    position: 'relative',
  },
  delete: {
    fontSize: 23,
    letterSpacing: 1,
    fontWeight: "bold",
    transform: [{ rotate: '90deg' }],
    color: "#808080"
  },
  viewDelete: {
    position: "absolute",
    top:-31,
    right: 43,
    zIndex: 100000000,
    width: 160,
    backgroundColor: "#fff",
    borderRadius:2,
  },
  editDelete: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12,
  },
  editDeleteText: { 
    marginLeft: 10, 
    fontSize: 16 ,
    letterSpacing:2,
    color:"#737373"
  },
});