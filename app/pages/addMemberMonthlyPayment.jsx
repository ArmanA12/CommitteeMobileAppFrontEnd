import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import axios from 'axios';
import { getAllCommitteMember } from '../../api/api';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

export default function AddMemberPayment() {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedUserID, setSelectedUserID] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [ammour, setAmmour] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHide, setshowHide] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const password = "1234"
    const navigation = useNavigation();
    navigation.setOptions({ headerShown: false });
    const router = useRouter();

    useEffect(() => {
        const fetchMembers = async () => {
            const memberData = await getAllCommitteMember();
            console.log(memberData, "member data");
            if (memberData) {
                setMembers(memberData);
            }
            setLoading(false);
        };

        fetchMembers();
    }, []);


    const handleback = () => {
        router.replace('(tabs)/Home')
    }

    const validateForm = () => {
        if (!selectedMember) {
            setError('Please select a member.');
            return false;
        } else if (!selectedMonth) {
            setError('Please select a month.');
            return false;
        } else if (!selectedYear) {
            setError('Please select a year.');
            return false;
        } else if (ammour.trim() === '') {
            setError('Please enter the amount.');
            return false;
        }
        setError('');
        return true;
    };

    const refArray = [];

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            console.log(
                selectedMember,
                selectedUserID,  // userID to be logged here
                selectedMonth,
                selectedYear,
                ammour,
                selectedUserID
            );
            try {
                const response = await axios.post('https://committee-mobile-app-backend.vercel.app/api/v1/auth/addMemberPayment', {
                    memberName: selectedMember,
                    month: selectedMonth,
                    year: selectedYear,
                    amount: ammour,
                    userID: selectedUserID
                });
                Alert.alert('Success', 'Member payment added successfully');
                setLoading(false);
                setSelectedMember('');
                setSelectedUserID('');
                setSelectedMonth('');
                setSelectedYear('');
                setAmmour('');
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', error.response?.data?.message || 'Error in adding member payment');
            }
        }
    };

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            refArray[index + 1].focus();
        }
    };

    const finalSubmit = () => {
        const otpCode = otp.join('');
        if (password === otpCode) {
            handleSubmit();
        }
        else {
            Alert.alert("Wrong Password", "Please enter the correct password")
        }
    }


    const showAdminPopup = () => {
        setshowHide(true);
    }

    return (
        <LinearGradient
            colors={['#f2f2f2', '#f2f2f2', '#f2f2f2']}
            style={styles.container}
        >
            <Header headerTitle="Add Member Payment" pushRoute={handleback} />
            <View style={styles.icons}>
                <FontAwesome style={{ marginBottom: 2 }} name="rupee" size={70} color="#008080" />
            </View>
            <Text style={styles.title}>Add Member Payment</Text>

            <View style={styles.inputmain}>
                <Picker
                    selectedValue={selectedMember}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedMember(itemValue);
                        setSelectedUserID(members[itemIndex - 1]?._id || '');
                        console.log(members[itemIndex - 1]?._id)
                    }}
                >
                    <Picker.Item label="Select Member" value="" />
                    {members.map((member, index) => (
                        <Picker.Item key={index} label={member.username} value={member.username} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputmain}>
                <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                    <Picker.Item label="Select Month" value="" />
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                        <Picker.Item key={index} label={month} value={month} />
                    ))}
                </Picker>
            </View>

            {/* Select Year */}
            <View style={styles.inputmain}>
                <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                    <Picker.Item label="Select Year" value="" />
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year, index) => (
                        <Picker.Item key={index} label={String(year)} value={String(year)} />
                    ))}
                </Picker>
            </View>


            <View style={styles.inputmain}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Amount"
                    placeholderTextColor="#262626"
                    keyboardType="numeric"
                    value={ammour}
                    onChangeText={setAmmour}
                />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={showAdminPopup} disabled={loading}>
                {loading ? <Loader /> : <Text style={styles.buttonText}>Add Payment <MaterialCommunityIcons name="arrow-top-right" size={24} color="#f2f2f2" /></Text>}
            </TouchableOpacity>


            {
                showHide ?
                    <View style={styles.popupMain}>
                        <View style={styles.adminPopup}>
                            <Text style={{ fontSize: 23, textAlign: "center", color: "#008080", fontWeight: "bold", marginBottom: 5 }}>Password</Text>
                            <Text style={{ textAlign: "center", marginBottom: 20 }}>If You are Admin Then Plesae Add Password</Text>
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
                                <TouchableOpacity onPress={() => setshowHide(false)}>
                                    <Text style={{ fontWeight: "bold", color: "red", paddingHorizontal: 20, paddingVertical: 8, }}>Cencel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => finalSubmit()} disabled={loading}>
                                    {loading ? <Loader /> : <Text style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "rgba(0,0,0,0.09)", borderRadius: 50 }}>Processed</Text>}
                                </TouchableOpacity>

                            </View>



                        </View>
                    </View> : ""
            }

        </LinearGradient>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BBB4A8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: "100%"
    },
    icons: {
        width: 130,
        height: 130,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 20,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderLeftColor: "rgba(255,255,255,0.5)",
        borderBottomColor: "rgba(255,255,255,0.5)"
    },
    title: {
        fontSize: 24,
        color: '#008080',
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "left"
    },
    inputmain: {
        width: '100%',
        position: "relative",
        marginBottom: 2,
        width: '100%',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 3,

        color: '#000',
        backgroundColor: "rgba(255,255,255,0.4)",
        borderStyle: "dashed",
        marginTop:15
    },
    picker: {
        width: '100%',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 3,
        padding: 1,
        color: '#000',
        backgroundColor: "rgba(255,255,255,0.4)",
        borderStyle: "dashed",
        
    },
    input: {
        width: '100%',
        borderRadius: 3,
        padding: 14,
        color: '#000',
        height:55,
        backgroundColor: "rgba(255,255,255,0.4)",

    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#008080',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
        marginTop:25
    },
    buttonText: {
        color: "#f2f2f2",
        textAlign: "center",
        letterSpacing: 2,
        fontSize:20
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
        width: "120%",
        height: "110%",
        backgroundColor: "rgba(0,0,0,0.4)",
        flexDirection: "row", justifyContent: "center",
        zIndex:199999999
    }

});