import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { getAllMemberMonthlyPaymentDetails, membersAmountCalculator, getCurrentMonthYear } from '../../api/api';
import Header from '../../components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

export default function AllMemberMonthlyPaymentDetails() {
  const navigation = useNavigation();
  const router = useRouter();
  const [allMemberMonthlyData, setAllMemberMonthlyData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('');

  const dummy = Array.from({ length: 15 }, (_, i) => i + 1);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const fetchMembers = async () => {
      setLoading(true);
      const memberData = await getAllMemberMonthlyPaymentDetails();
      const resAmount = await membersAmountCalculator();

      if (memberData) {
        setAllMemberMonthlyData(memberData);
        setTotalAmount(resAmount);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const { currentYear } = getCurrentMonthYear();
    setSelectedYear(currentYear.toString());
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December', 'Due Amount'
  ];

  const getPaymentStatusForMonth = (payments, month) => {
    const paymentForMonth = payments.find((payment) => payment.month === month);
    return paymentForMonth ? paymentForMonth.amount : 'Pending';
  };

  const calculateDueAmount = (payments) => {
    const monthlyPayment = 500;
    const totalMonths = 12;
    let paidMonthsCount = payments.filter(payment => payment.amount && parseInt(payment.amount) > 0).length;
    let dueMonthsCount = totalMonths - paidMonthsCount;
    return dueMonthsCount * monthlyPayment;
  };

  const groupByMember = allMemberMonthlyData
    .filter(item => item.year === selectedYear)
    .reduce((acc, payment) => {
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
        {dummy.map((index) => (
          <View key={index} style={styles.loadingPlaceholder}>
            <View style={styles.loadingBlock}></View>
            <View style={styles.loadingBlock}></View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header headerTitle="Member Payment Details" pushRoute='/' />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>All Member Monthly Payments</Text>
        <View>
          <View style={styles.amountDetails}>
            <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 20, letterSpacing: 3, color: "#008080", paddingVertical: 4 }}>Total Balance</Text>
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

        <Text style={styles.sectionTitle}>Year Wise Payment Data</Text>
        <View style={styles.inputMain}>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
          >
            <Picker.Item label="Select Year" value="" />
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <Picker.Item key={year} label={String(year)} value={String(year)} />
            ))}
          </Picker>
        </View>


        {
          Object.keys(groupByMember).length > 0 ? (
                    Object.keys(groupByMember).map((memberName, index) => (
          <View key={index} style={styles.memberSection}>
            <View style={styles.memberHeader}>
              <Feather name="user" size={26} color="#f2f2f2" />
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
        ))

          ) : 
          <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center", borderWidth:1, borderColor:"rgba(0,0,0,0.01)", borderRadius:10, paddingVertical:25, backgroundColor:"white", gap:15}}>
            <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <FontAwesome name="question-circle-o" size={70} color="#ff4d4d" />
            </View>
          <Text style={styles.noDataText}>Now Payment Data for This Years
          </Text>
          </View>
        }

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
  sectionTitle: {
    color: "#737373",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
},
noDataText:{
  color: "#737373",
  letterSpacing: 2,
  marginTop: 16,
  marginBottom: 8,

},
inputMain: {
  marginBottom: 10,
  backgroundColor: "white",
  borderColor: '#ddd',
  borderRadius: 3,
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.02)"
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
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 2
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#008080",
    paddingHorizontal: 10,

  },
  memberName: {
    fontSize: 19,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 13,
    letterSpacing: 3,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
    color:"#f2f2f2"
  },
  table: {
    backgroundColor: '#fff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderStyle:"dashed",
    

  },
  dueAmountRow: {
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 15,
    borderRadius: 1,
    marginTop: 5,
    marginBottom:10,
    letterSpacing:2
  },
  month: {
    fontSize: 16,
    color: '#333',
    letterSpacing:2
  },
  amount: {
    fontSize: 16,
    color: '#333',
    letterSpacing:2
  },
  amountDetails: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
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
    marginTop: 70,
    textAlign: "center",
    letterSpacing: 2,
    fontSize: 18,
    color: "#404040"
  }
});