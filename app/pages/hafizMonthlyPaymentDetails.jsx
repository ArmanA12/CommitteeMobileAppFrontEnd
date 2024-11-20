import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Header from '../../components/Header';
import { getAllHafizMonthlyPaymentDetails, hafizAmountCalculator } from '../../api/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function HafizMonthlyPaymentDetails() {
  const navigation = useNavigation();
  const router = useRouter();
  const [hafiz, sethafiz] = useState([]);
  const [hafizAmount, sethafizAmount] = useState('');

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const hafizMonthlyPaymentData = async () => {
      const res = await getAllHafizMonthlyPaymentDetails();
      const haifzAmountres = await hafizAmountCalculator();
      if (res) {
        sethafiz(res);
        sethafizAmount(haifzAmountres);
      }
    }
    hafizMonthlyPaymentData();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Header headerTitle="Hafiz Payment Details" pushRoute={() => router.replace('/(tabs)/home')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 23, color: "#008080", marginTop: 30 }}>Hafiz Monthly Payment Details</Text>
          <View>
            <View style={styles.amountDetails}>
              <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 20, letterSpacing: 3, color: "#000" }}>Total Balance</Text>
              <Text style={{ fontSize: 45, color: "#737373", letterSpacing: 2 }}>₹ {hafizAmount}.<Text style={{ color: "#b3b3b3" }}>00</Text></Text>

              <TouchableOpacity onPress={() => router.replace('/pages/addHafizMonthlyPayment')}>
                            <View style={styles.right}>
                                <Text style={styles.addPaymentText}>Add Hafiz Payment</Text>
                                <FontAwesome name="plus-square-o" size={22} color="#b3b3b3" />
                            </View>
                        </TouchableOpacity>

            </View>
            
          </View>

          <View style={styles.paymentContainer}>
            {
              hafiz.map((item, index) => {
                return (
                  <View style={styles.payment} key={index}>
                    <View style={styles.table}>
                      <Text style={styles.tableLeft}><FontAwesome name="user-circle-o" size={20} color="#595959" />&nbsp;Hafiz Name</Text>
                      <Text style={styles.tableLeft}>{item.hafizName}</Text>
                    </View>
                    <View style={styles.table}>
                      <Text style={styles.tableLeft}><FontAwesome name="calendar" size={20} color="#595959" />&nbsp;Month</Text>
                      <Text style={styles.tableLeft}>{item.month}</Text>
                    </View>
                    <View style={styles.table}>
                      <Text style={styles.tableLeft}><FontAwesome name="rupee" size={18} color="#595959" />&nbsp;&nbsp;Amount</Text>
                      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#008080" }}>₹&nbsp;{item.amount}</Text>
                    </View>

                  </View>
                )
              })
            }

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 80,
    textAlign: 'center',
    marginBottom: 10,
    color: '#008080',
  },
  amountDetails: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderRadius: 17,
    borderColor: "rgba(0,0,0,0.03)",
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.7)",
    marginBottom: 2,
    borderStyle: 'dashed',

  },

  paymentContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.8)",

  },
  payment: {
    padding: 10,
    paddingVertical: 10,
    borderBottomColor: "rgba(0,0,0,0.04)",
    borderBottomWidth: 8,
    marginTop: 6


  },
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.0)"

  },
  tableLeft: {
    fontSize: 18,
    color: "#666666"
  },
  right: { flexDirection: 'row', justifyContent: 'center',alignItems:"center", marginTop: 10, marginRight: 5,  backgroundColor:"rgba(0,0,0,0.04)" , borderWidth:1, borderColor:"rgba(0,0,0,0.2)", borderStyle:"dashed", paddingVertical:10 },
  addPaymentText: { marginTop: 2, marginRight: 4, fontSize: 15, color: '#737373', letterSpacing:2,},

});
