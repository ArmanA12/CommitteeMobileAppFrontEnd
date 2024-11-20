import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../../../components/Header';
import { getMemberProfileData, getAllMemberMonthlyPaymentDetails } from '../../../api/api';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import UploadProfileImage from '../../../components/ProfileImageUploader';

export default function MemberProfile() {
    const { id } = useLocalSearchParams(); 
    const router = useRouter();
    const [userProfile, setUserProfile] = useState({});
    const navigation = useNavigation();
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [memberAllMonthPayment, setMemberAllMonthPayment] = useState([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        const profileFetcher = async () => {
            try {
                const res = await getMemberProfileData(id);
                const paymentMemberResult = await getAllMemberMonthlyPaymentDetails();
                console.log(paymentMemberResult, "Full Payment details fetched");
                setMemberAllMonthPayment(paymentMemberResult);
                setUserProfile(res);
                console.log(res, "member profile");
            } catch (error) {
                Alert.alert("Unable to Fetch Member Profile");
            }
        };
        profileFetcher();
    }, [showImageUploader]);


    

    const renderMonthlyPaymentStatus = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    
        return months.map((month, index) => {
            const paymentDetail = memberAllMonthPayment.find(item => item.userID === id && item.month === month);
            return (
                <View key={index} style={styles.monthPaymentItem}>
                    <Text style={styles.monthText}>{month}</Text>
                    <Text style={styles.paymentStatusText}>
                        {paymentDetail ? <AntDesign name="check" size={20} color="#008080" /> : <AntDesign name="close" size={20} color="red" />}
                    </Text>
                </View>
            );
        });
    };


    useEffect(() => {
        const count = memberAllMonthPayment.reduce((total, item) => {
            if (item.userID === id) {
                return total + 1;
            }
            return total;
        }, 0); 

        setCounter(count); 
    }, [memberAllMonthPayment, id]);
    
    return (
        <ScrollView style={styles.container}>
            <Header headerTitle="Member Profile" pushRoute={() => router.replace('(tabs)/home')} />

            <View style={styles.profileImageContainer}>
                <View style={styles.profileImageDesign}>
                    {userProfile.profilePic ? (
                        <Image
                            source={{ uri: userProfile?.profilePic }}
                            style={{
                                width: 140,
                                height: 140,
                                borderRadius: 100,
                                objectFit: "fill",
                                padding: 4,
                                borderWidth: 3,
                                borderColor: "rgba(0,0,0,0.03)",
                                borderStyle: "dashed",
                                backgroundColor: "rgba(255,255,255,0.6)",
                            }}
                        />
                    ) : (
                        <FontAwesome5 name="user" size={90} color="#b3b3b3" />
                    )}
                </View>
            </View>

            <View style={styles.othersDetails}>
                <Text style={styles.sectionTitle}>Member Information</Text>
                <View style={styles.mobileName}>
                    <FontAwesome5 name="user-circle" size={28} color="#008080" />
                    <Text style={styles.infoText}>{userProfile?.username}</Text>
                </View>

                <View style={{ height: 10 }} />

                <View style={styles.mobileName}>
                    <FontAwesome5 name="phone-square-alt" size={28} color="#008080" />
                    <Text style={styles.infoText}>{userProfile?.mobileNumber}</Text>
                </View>

                <Text style={styles.sectionTitle}>Amount Information</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={styles.mobileNameAmount}>
                        <View style={styles.rupee}>
                            <FontAwesome5 name="rupee-sign" size={28} color="#008080" />
                        </View>
                        <Text style={styles.amountLabel}>Paid Amount</Text>
                        <Text style={styles.amountValue}>₹{counter*500}</Text>
                    </View>

                    <View style={styles.mobileNameAmount}>
                        <View style={styles.rupee}>
                            <FontAwesome5 name="rupee-sign" size={28} color="#008080" />
                        </View>
                        <Text style={styles.amountLabel}>Pending Amount</Text>
                        <Text style={styles.amountValue}>₹{12 * 500 - counter * 500}</Text>
                        </View>
                </View>
            </View>

            <View style={styles.uploadContainer}>
                <AntDesign name="upload" size={24} color="#737373" />
                <TouchableOpacity onPress={() => setShowImageUploader(true)}>
                    <Text style={styles.uploadText}>
                        {userProfile.profilePic ? "UPDATE PROFILE" : "UPLOAD PROFILE"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                {showImageUploader && <UploadProfileImage onClose={() => setShowImageUploader(false)} userID={userProfile._id} />}
            </View>
           <Text style={{height:30}}>&nbsp;</Text>
            <Text style={styles.sectionTitle}>Monthly Payment Status</Text>
            <View style={styles.monthlyPaymentContainer}>
                {renderMonthlyPaymentStatus()}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    profileImageContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        width: "100%",
        marginTop: 75
    },
    profileImageDesign: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderRadius: 100,
        borderColor: "#efeff5",
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
    },
    othersDetails: {
        width: "100%",
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.4)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.01)",

    },
    sectionTitle: {
        color: "#737373",
        letterSpacing: 2,
        marginTop: 16,
        marginBottom: 8,
    },
    mobileName: {
        flexDirection: "row",
        gap: 17,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.4)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        borderStyle: "dashed",

    },
    infoText: {
        color: "#737373",
        letterSpacing: 1,
        fontSize: 18,
    },
    monthlyPaymentContainer: {
        marginBottom: 10,
    },
    monthPaymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        backgroundColor:"rgba(255,255,255,0.6)",
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderBottomColor:"rgba(0,0,0,0.2)",
        borderStyle:"dashed"
    },
    monthText: {
        color: "#737373",
        fontSize: 16,
        letterSpacing:2
    },
    paymentStatusText: {
        color: "#737373",
        fontSize: 16,
        letterSpacing:1

    },
    rupee:{
        backgroundColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderRadius: 100,
        borderColor: "#efeff5",
        shadowColor: "#9393bc",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.11,
        shadowRadius: 4,
        elevation: 3,
        width:60,
        height:60,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    
    },
    mobileNameAmount: {
        flexDirection: "column",
        alignItems: "center",
        width: "48%",
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.4)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        borderStyle: "dashed",

    },
    amountLabel: {
        color: "#737373",
        fontSize: 15,
        textAlign: "center",
        paddingVertical:10,
        letterSpacing:1
    },
    amountValue: {
        color: "#737373",
        fontSize: 18,
        backgroundColor: "rgba(0,0,0,0.03)",
        paddingVertical: 10,
        textAlign: "center",
        width: "100%",
        letterSpacing:3

    },
    uploadContainer: {
        backgroundColor: "rgba(255,255,255,0.7)",
        marginTop: 10,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.03)",
        borderStyle: "dashed",
    },
    uploadText: {
        color: "#737373",
        fontSize: 18,
        marginLeft: 10,
        letterSpacing:3

    },
});
