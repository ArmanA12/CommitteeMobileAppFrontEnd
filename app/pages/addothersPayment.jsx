import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function addothersPayment() {
    const [ammour, setAmmour] = useState('');  
    const [notes, setNotes] = useState('');  
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHide, setshowHide] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const password = "1234"
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(()=>{
        navigation.setOptions({ headerShown: false });
    },[])

    const refArray = [];

    const validateForm = () => {
        if (ammour.trim() === '') {
            setError('Please enter the amount.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await axios.post('https://committee-mobile-app-backend.vercel.app/api/v1/auth/addOthersPayments', {
                    amount: ammour,
                    notes: notes,
                });
                Alert.alert('Success', 'Payment added successfully');
                setLoading(false);
                setAmmour('');
                setNotes('');
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', error.response?.data?.message || 'Error in adding payment');
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
            <Header headerTitle="Add Others Payment" pushRoute={() => router.replace('(tabs)/Home')} />
            <View style={styles.icons}>
                <FontAwesome style={{ marginBottom: 2 }} name="rupee" size={70} color="#008080" />
            </View>
            <Text style={styles.title}>Add Others Payment</Text>

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

            <View style={styles.inputmain}>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter additional notes..."
                    placeholderTextColor="#262626"
                    value={notes}
                    onChangeText={setNotes}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={showAdminPopup} disabled={loading}>
                {loading ? <Loader /> : <Text style={styles.buttonText}>Add Payment !</Text>}
            </TouchableOpacity>

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
                            <TouchableOpacity onPress={() => setshowHide(false)}>
                                <Text style={{ fontWeight: "bold", color: "red", paddingHorizontal: 20, paddingVertical: 8 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => finalSubmit()} disabled={loading}>
                                {loading ? <Loader /> : <Text style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "rgba(0,0,0,0.09)", borderRadius: 50 }}>Proceed</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 3,
        padding: 14,
        color: '#000',
        backgroundColor: "rgba(255,255,255,0.4)",
        borderStyle: "dashed"
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
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
        borderColor: "rgba(255,255,255,0.4)"
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 19,
        letterSpacing:2
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
