import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import Header from '../../components/Header';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllHafizMonthlyPaymentDetails, hafizAmountCalculator, othersAmountCalculator, membersAmountCalculator } from '../../api/api';


export default function DataFetcher() {
  const navigation = useNavigation();
  const [allMemberMonthlyData, setAllMemberMonthlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [hafizAmount, sethafizAmount] = useState('');
  const [memberTotalAmount, setMemberTotalAmount] = useState('');
  const [otherTotalAmount, setOtherTotalAmount] = useState('');


  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://committee-mobile-app-backend.vercel.app/api/v1/auth/getAllMemberMonthlyPaymentDetails');
      const haifzAmountres = await hafizAmountCalculator();
      const totalOtherAmount = await othersAmountCalculator();
      const totalMemberAmount = await membersAmountCalculator();
      

      if (res.data) {
        setAllMemberMonthlyData(res.data);
        sethafizAmount(haifzAmountres);
        setMemberTotalAmount(totalMemberAmount)
        setOtherTotalAmount(totalOtherAmount)

      }
    } catch (error) {
      console.error(error, 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const filteredData = selectedYear
    ? allMemberMonthlyData.filter(item => item.year === selectedYear)
    : allMemberMonthlyData;

  const memberStatusMap = {};
  filteredData.forEach(item => {
    const { memberName, month } = item;
    if (!memberStatusMap[memberName]) {
      memberStatusMap[memberName] = Array(12).fill('No');
    }
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      memberStatusMap[memberName][monthIndex] = 'Yes';
    }
  });

  const getCellStyle = (paymentStatus) => ({
    ...styles.cell,
    backgroundColor: paymentStatus === 'Yes' ? '#008080' : '#f8f8f8',
    color: paymentStatus === 'Yes' ? 'white' : 'black',
    borderRightWidth: 1
  });

  const generatePDF = async () => {
    setIsDisabled(true)
    try {
      let tableRows = '';
      Object.entries(memberStatusMap).forEach(([memberName, status]) => {
        tableRows += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${memberName}</td>
            ${status.map(
          (paymentStatus) =>
            `<td style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: ${paymentStatus === 'Yes' ? '#008080' : '#f8f8f8'
            }; color: ${paymentStatus === 'Yes' ? 'white' : 'black'};">${paymentStatus}</td>`
        ).join('')}
          </tr>
        `;
      });


      const htmlContent = `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background-color: #f5f5f5; 
              color: #333; 
            }
            h1 { 
              text-align: center; 
              color: #008080; 
              margin-bottom: 30px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            th { 
              background-color: #d9d9d9; 
              padding: 10px; 
              text-align: center; 
              font-weight: bold; 
              border-right:1px solid #f2f2f2;
            }
            td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: center; 
            }
            tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            .info { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
              gap: 15px; 
              margin-top: 30px; 
              background-color: #fff; 
              padding: 20px; 
              border: 1px solid #ddd; 
              border-radius: 8px; 
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
            }
            .info div { 
              background-color: rgba(0,0,0,0.04); 
              padding: 15px; 
              border-radius: 3px; 
              font-size: 16px; 
              line-height: 1.6; 
              text-align: center; 
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03); 
            },
            p{
             margin-top:20px;
             font-size:20px;
             font-waight:600;
             latter-spacing:2px;
             margin-bottom:4px;
            }
            .info div strong { 
              display: block; 
              margin-top: 10px; 
              font-size: 23px; 
              color: #008080; 
              letter-spacing:2px;
              background-color: rgba(255,255,255,0.7); 
              border:1px solid rgba(0,0,0,0.02);
              padding-left:20px;
              padding-right:20px;
              padding-top:10px;
              padding-bottom:10px;
              border-radius:3px;


            }
          </style>
        </head>
        <body>
          <h1>Member Payment Status Report - ${selectedYear || 'All Years'}</h1>
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                ${months.map((month) => `<th>${month}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody> 
          </table>
          <div class="info">
            <div>
              The total number of amount in committee
              <strong>₹ ${memberTotalAmount}/-</strong>
            </div>
            <div>
              The total amount given to Hafiz Ji so far 
              <strong>₹ ${hafizAmount}/-</strong>
            </div>
            <div>
              Total other amounts contributed to the committee
              <strong>₹ ${otherTotalAmount}/-</strong>
            </div>
            <div>
              Current Account Status
              <strong>₹ ${memberTotalAmount - hafizAmount}/-</strong>
            </div>
          </div>
        </body>
      </html>
    `;
    


      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (uri) {
        Alert.alert('Success', `PDF generated at: ${uri}`);
        setIsDisabled(false)
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          setIsDisabled(false)
          Alert.alert('Error', 'Sharing is not available on this device.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      setIsDisabled(false)
    }
  };


  return (
    <View style={styles.container}>
      <Header headerTitle="Due Payment" pushRoute="/pages/allMemberMonthlyPaymentDetails" />
      <Text style={styles.header}>Member Payment Status</Text>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#008080" />
        ) : (
          <View style={styles.table}>
            <View style={styles.fixedColumn}>
              <Text style={styles.cellMonth}>Member Name</Text>
              {Object.keys(memberStatusMap).map(memberName => (
                <Text key={memberName} style={styles.cell}>{memberName}</Text>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.scrollableColumn}>
                <View style={styles.row}>
                  {months.map((month, index) => (
                    <Text key={index} style={styles.cellMonth}>{month}</Text>
                  ))}
                </View>
                {Object.entries(memberStatusMap).map(([memberName, status]) => (
                  <View key={memberName} style={styles.row}>
                    {status.map((paymentStatus, index) => (
                      <Text key={index} style={getCellStyle(paymentStatus)}>{paymentStatus}</Text>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}




        <LinearGradient
          colors={isDisabled ? ['gray', 'gray', 'gray'] : ['#527a7a', '#006666', '#39ac73']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.downloadButton} >
          <TouchableOpacity onPress={generatePDF} disabled={isDisabled}>
            <Text style={styles.downloadText}>DOWNLOAD PDF  <AntDesign name="download" size={24} color="#f2f2f2" /></Text>
          </TouchableOpacity>
        </LinearGradient>
        
      </ScrollView>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 17,

    backgroundColor: '#f2f2f2',
    justifyContent: "center",


  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 90,
    textAlign: 'center',
    color: '#008080',
    letterSpacing: 2,
  },
  inputMain: {
    marginBottom: 10,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderColor: '#ddd',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)"
  },
  picker: {
    height: 50,
  },
  table: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
  },
  fixedColumn: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  scrollableColumn: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    minWidth: 80,
    padding: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cellMonth: {
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#d9d9d9',
  },
  downloadButton: {
    marginTop: 30,
    backgroundColor: '#008080',
    borderRadius: 100,
    paddingVertical: 18,
  },
  downloadText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 2,
  },
});
