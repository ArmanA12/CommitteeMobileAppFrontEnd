import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Header from '../../components/Header';
import { getAllOthersPaymentDetails, othersAmountCalculator, updateOthersPaymentDetails, deleteOthersPayment } from '../../api/api'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Loader from '../../components/Loader';

export default function OthersPaymentDetails() {
    const navigation = useNavigation();
    const [hafiz, setHafiz] = useState([]);
    const [hafizAmount, setHafizAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHide, setShowHide] = useState(false); 
    const [editIndex, setEditIndex] = useState(null);
    const [otp, setOtp] = useState(['', '', '', '']);
    const password = "1234";
    const [currentAction, setCurrentAction] = useState('');
    const refArray = [];
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        const fetchPaymentData = async () => {
            const res = await getAllOthersPaymentDetails();
            const hafizAmountres = await othersAmountCalculator();
            if (res) {
                setHafiz(res);
                setHafizAmount(hafizAmountres);
            }
        };
        fetchPaymentData();
    }, [navigation]);

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 3) {
            refArray[index + 1].focus();
        }
    };

    const finalSubmit = async () => {
        const otpCode = otp.join('');
        if (password === otpCode) {
            if (currentAction === 'edit') {
                await handleEditSubmit(); 
            } else if (currentAction === 'delete') {
                await handleDeleteSubmit(); 
            }
        } else {
            Alert.alert("Wrong Password", "Please enter the correct password");
        }
    };

    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            const updatedPaymentDetail = hafiz[editIndex];
            const res = await updateOthersPaymentDetails(updatedPaymentDetail); 
            if (res) {
                Alert.alert('Success', 'Payment details updated successfully');
                setShowHide(false);
                setEditIndex(null);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update payment details');
        }
        setLoading(false);
    };

    const handleDeleteSubmit = async () => {
        setLoading(true);
        try {
            const res = await deleteOthersPayment(hafiz[editIndex]._id);
            if (res) {
                setHafiz(hafiz.filter((_, index) => index !== editIndex));
                Alert.alert('Success', 'Payment details deleted successfully');
                setShowHide(false);
                setEditIndex(null);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete payment details');
        }
        setLoading(false);
    };

    const enableEdit = (index) => {
        setEditIndex(index);
    };

    const handleSave = (index) => {
        setEditIndex(index);
        setCurrentAction('edit');
        setShowHide(true); 
    };

    const handleDelete = (index) => {
        setEditIndex(index);
        setCurrentAction('delete');
        setShowHide(true); 
    };

    return (
        <View style={styles.container}>
            <Header headerTitle="Others Payment Details" pushRoute={() => router.replace('/(tabs)/home')} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Others Payment Details</Text>
                    <View style={styles.amountDetails}>
                        <Text style={styles.totalBalance}>Total Balance</Text>
                        <Text style={styles.amount}>₹ {hafizAmount}.<Text style={styles.amountDecimal}>00</Text></Text>
                        <TouchableOpacity onPress={() => router.replace('/pages/addothersPayment')}>
                            <View style={styles.right}>
                                <Text style={styles.addPaymentText}>Add Others Payment</Text>
                                <FontAwesome name="plus-square-o" size={22} color="#b3b3b3" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.sectionTitle}>Monthly Payment Status</Text>

                    <View style={styles.paymentContainer}>
                        {hafiz.map((item, index) => {
                            const isEditable = index === editIndex;
                            return (
                                <View style={styles.payment} key={index}>
                                    {isEditable ? (
                                        <View style={{paddingHorizontal:10}}>
                                            <TextInput
                                                style={styles.editableInput}
                                                value={hafiz[editIndex]?.amount?.toString() || ''}
                                                onChangeText={(value) => {
                                                    const newHafiz = [...hafiz];
                                                    newHafiz[editIndex].amount = value;
                                                    setHafiz(newHafiz);
                                                }}
                                            />
                                            <TextInput
                                                style={styles.editableInput}
                                                value={hafiz[editIndex]?.notes || ''}
                                                multiline={true}
                                                numberOfLines={4}
                                                onChangeText={(value) => {
                                                    const newHafiz = [...hafiz];
                                                    newHafiz[editIndex].notes = value;
                                                    setHafiz(newHafiz);
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <>
                                            <Text style={styles.paymentText}>Amount: ₹&nbsp;{item.amount}</Text>
                                            <Text style={styles.tableLeft}>{item.notes}</Text>
                                        </>
                                    )}

                                    <View style={styles.table}>
                                        {isEditable ? (
                                            <View style={{flexDirection:"row"}}>
                                                <TouchableOpacity onPress={() => handleSave(index)}>
                                                <View style={styles.editDelete}>
                                                    <FontAwesome name="bookmark-o" size={18} color="#008080" />
                                                    <Text style={styles.editDeleteText}>Save</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setEditIndex(null)}>
                                                <View style={styles.editDelete}>
                                                    <FontAwesome name="remove" size={18} color="#008080" />
                                                    <Text style={styles.editDeleteText}>Cencel</Text>
                                                </View>
                                            </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity onPress={() => enableEdit(index)}>
                                                <View style={styles.editDelete}>
                                                    <FontAwesome name="pencil-square-o" size={18} color="#008080" />
                                                    <Text style={styles.editDeleteText}>Edit</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity onPress={() => handleDelete(index)}>
                                            <View style={styles.editDelete}>
                                                <FontAwesome name="trash-o" size={18} color="red" />
                                                <Text style={styles.editDeleteText}>Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    
                </View>
            </ScrollView>
            {showHide && (
                        <View style={styles.popupMain}>
                            <View style={styles.adminPopup}>
                                <Text style={styles.popupTitle}>Password</Text>
                                <Text style={styles.popupDescription}>If you are an Admin, please enter the password</Text>
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
                                <View style={styles.popupButtons}>
                                    <TouchableOpacity onPress={() => setShowHide(false)}>
                                        <Text style={styles.cancelButton}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={finalSubmit} disabled={loading}>
                                        {loading ? <Loader /> : <Text style={styles.processButton}>Proceed</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
        </View>
    );
}















const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f2', padding: 16 },
    header: { fontSize: 20, fontWeight: 'bold', marginTop: 30, textAlign: 'center', marginBottom: 10, color: 'gray' },
    title: { textAlign: 'center', letterSpacing:2, fontSize: 23, color: "#008080", marginTop: 30 },
    amountDetails: { borderWidth: 1, marginTop: 10, paddingHorizontal: 20, paddingVertical: 17, borderRadius: 17, borderColor: "rgba(0,0,0,0.03)", backgroundColor: "rgba(255,255,255,0.7)", marginBottom: 2},
    totalBalance: { fontFamily: "Cairo-SemiBold", fontSize: 20, letterSpacing: 3, color: "#000" },
    amount: { fontSize: 45, color: "#737373", letterSpacing: 2 },
    amountDecimal: { color: "#b3b3b3" },
    right: { flexDirection: 'row', justifyContent: 'center',alignItems:"center", marginTop: 10, marginRight: 5,  backgroundColor:"rgba(0,0,0,0.04)" , borderWidth:1, borderColor:"rgba(0,0,0,0.2)", borderStyle:"dashed", paddingVertical:10 },
    addPaymentText: { marginTop: 2, marginRight: 4, fontSize: 15, color: '#737373', letterSpacing:2,},
    paymentContainer: { marginTop: 10, borderRadius: 5, backgroundColor: '#f2f2f2'},
    payment:{
        backgroundColor:"rgba(255,255,255,0.8)",
        borderRadius:10,
        borderLeftWidth:1,
        borderTopWidth:1,
        borderRightWidth:1,
        borderLeftColor:"rgba(0,0,0,0.03)",
        borderRightColor:"rgba(0,0,0,0.03)",
        borderTopColor:"rgba(0,0,0,0.03)"
    },

    paymentText: { fontSize: 18, marginBottom: 5, fontWeight: '500', paddingHorizontal:10,paddingVertical:12,  },
    tableLeft: { color: '#737373', fontSize: 16, paddingLeft: 10, paddingBottom: 10 },
    table: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, marginTop:20, borderBottomWidth:10, borderBlockColor:"#f2f2f2" },
    editDelete: { flexDirection: 'row', alignItems: 'center', marginRight:10, marginLeft:10, marginBottom:10, backgroundColor:"rgba(0,0,0,0.04)" , borderWidth:1, borderColor:"rgba(0,0,0,0.1)", borderStyle:"dashed", paddingVertical:6,paddingHorizontal:12},
    editDeleteText: { marginLeft: 4, fontSize: 15 },
    editableInput: { borderBottomWidth: 1, borderBottomColor: '#737373', fontSize: 16, marginBottom: 5, paddingHorizontal:10,
        borderRadius:1, borderColor:"rgba(0,0,0,0.2)", borderStyle:"dashed", borderWidth:1
     },
    popupMain: { position:"absolute", top: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', width:"110%", height:"110%",padding:20, zIndex:199999999 },
    adminPopup: { width: '100%', padding: 20, backgroundColor: '#f2f2f2', borderRadius: 10, },
    popupTitle: { fontSize: 25, fontWeight: 'bold', marginBottom: 10, color:"#008080", letterSpacing:3, textAlign:"center" },
    popupDescription: { fontSize: 16, color: '#737373', marginBottom: 15, textAlign:"center" },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    otpInput: { width: 40, height: 40, borderWidth: 1, borderColor: '#737373', textAlign: 'center', fontSize: 20, borderRadius: 5 },
    popupButtons: { flexDirection: 'row', justifyContent: 'space-between',alignItems:"center" },
    cancelButton: { fontSize: 16, color: 'red' },
    processButton: { fontSize: 16, color: '#008080', fontWeight: 'bold' ,backgroundColor: 'rgba(0,0,0,0.03)',paddingHorizontal:20,paddingVertical:8, borderRadius:100, borderWidth:1, borderColor:"rgba(0,0,0,0.1)", borderStyle:"dashed"},
    sectionTitle: {
        color: "#737373",
        letterSpacing: 2,
        marginTop: 20,
    
    },
    
});
