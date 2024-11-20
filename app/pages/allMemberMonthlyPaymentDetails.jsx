import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { getAllMemberMonthlyPaymentDetails, membersAmountCalculator } from '../../api/api';
import Header from '../../components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';

export default function AllMemberMonthlyPaymentDetails() {
  const navigation = useNavigation();
  const router = useRouter();
  const [allmembermonthlyData, setAllMemberMonthlyData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const dummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15];

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const fetchMembers = async () => {
      const memberData = await getAllMemberMonthlyPaymentDetails();
      const resamount = await membersAmountCalculator();
      if (memberData) {
        setAllMemberMonthlyData(memberData);
        setTotalAmount(resamount);
      }
      setLoading(false);
    };

    fetchMembers();
  }, [navigation]);

  const months = [
    'June', 'July', 'August',
    'September', 'October', 'November',
    'December', 'Due Amount'
  ];

  const getPaymentStatusForMonth = (payments, month) => {
    const paymentForMonth = payments.find((payment) => payment.month === month);
    return paymentForMonth ? paymentForMonth.amount : 'Pending';
  };

  const calculateDueAmount = (payments) => {
    const monthlyPayment = 500;
    const totalMonths = 6;
    let paidMonthsCount = payments.filter(payment => payment.amount && parseInt(payment.amount) > 0).length;
    let dueMonthsCount = totalMonths - paidMonthsCount;
    return dueMonthsCount * monthlyPayment;
  };

  const groupByMember = allmembermonthlyData.reduce((acc, payment) => {
    const { memberName } = payment;
    if (!acc[memberName]) {
      acc[memberName] = [];
    }
    acc[memberName].push(payment);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={{ marginTop: 100, padding: 16 }}>
        <View>
          {dummy.map((index) => (
            <View key={index} style={styles.loadingPlaceholder}>
              <View style={styles.loadingBlock}></View>
              <View style={styles.loadingBlock}></View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header headerTitle=" Member Payment Details" pushRoute={() => router.replace('/(tabs)/home')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>All Member Monthly Payments</Text>
        <View>
          <View style={styles.amountDetails}>
            <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 20, letterSpacing: 3, color: "#008080" }}>Total Balance</Text>
            <Text style={{ fontSize: 45, color: "#737373", letterSpacing: 2 }}>₹ {totalAmount}.<Text style={{ color: "#b3b3b3" }}>00</Text></Text>

            <View>
              <TouchableOpacity onPress={() => router.replace('/pages/membersCurrentmonthPayStatus')}>
                <View style={styles.right}>
                  <Text style={{ fontSize: 18, color: "#737373", letterSpacing: 2 }}>Current Month Status</Text>
                  <FontAwesome name="angle-double-right" size={22} color="#b3b3b3" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/pages/duePayment')}>
                <View style={styles.right}>
                  <Text style={{ fontSize: 18, color: "#737373", letterSpacing: 2 }}>View Due Payments</Text>
                  <FontAwesome name="angle-double-right" size={22} color="#b3b3b3" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {Object.keys(groupByMember).map((memberName, index) => (
          <View key={index} style={styles.memberSection}>
            <View style={styles.memberHeader}>
              <FontAwesome name="user-circle-o" size={30} color="#595959" />
              <Text style={styles.memberName}>{memberName}</Text>
            </View>
            <View style={styles.table}>
              {months.map((month, i) => (
                <View key={i} style={[styles.row, month === 'Due Amount' && styles.dueAmountRow]}>
                  <Text style={styles.month}>{month}</Text>

                  {month === 'Due Amount' ? (
                    <Text style={styles.amount}>{calculateDueAmount(groupByMember[memberName])}</Text>
                  ) : (

                    <Text style={styles.amount}>{getPaymentStatusForMonth(groupByMember[memberName], month)}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
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

  // Styles for loading placeholders
  loadingPlaceholder: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    height: 40,
    marginTop: 10,
    borderRadius: 6,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  loadingBlock: {
    backgroundColor: "#f2f2f2",
    width: "40%",
    height: 25,
    borderRadius: 10
  },


  memberSection: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.01)",
    borderRadius: 5
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,

  },
  memberName: {
    fontSize: 19,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 13,
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
    backgroundColor: "rgba(255,255,255,0.9)"
  },
  table: {
    backgroundColor: '#fff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",

  },
  dueAmountRow: {
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 8,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 5,
    marginBottom:10,
    borderWidth:1,
    borderColor:"#008080",
    borderStyle:"dashed"
  },
  month: {
    fontSize: 16,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    color: '#333',
  },
  amountDetails: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 17,
    borderColor: "rgba(0,0,0,0.03)",
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.7)",
    marginBottom: 20
  },
  right: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.01)",
    borderStyle: 'dashed',
  },
  header: {
    marginTop: 100,
    textAlign: "center",
    letterSpacing: 2,
    fontSize: 18,
    color: "#404040"
  }
});