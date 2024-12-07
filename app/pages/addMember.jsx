import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import axios from 'axios';

export default function Login() {
    const navigation = useNavigation();
    const [username, setusername] = useState('');
    const [mobileNumber, setmobileNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    navigation.setOptions({ headerShown: false });

    const router = useRouter();

    const validateForm = () => {
        if (username.trim() === '') {
            setError('Please enter your name.');
            return false;
        } else if (mobileNumber.trim() === '' || mobileNumber.length !== 10 || isNaN(mobileNumber)) {
            setError('Please enter a valid 10-digit number.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            try {
                const response = await axios.post('https://committee-mobile-app-backend.vercel.app/api/v1/auth/register', {
                    username,
                    mobileNumber,
                });
                Alert.alert('Success', 'Logged in successfully');
                setLoading(false)
                setmobileNumber('')
                setusername('')

            } catch (error) {
                setLoading(false);
                Alert.alert('Error', error.response?.data?.message || 'Member Already Registered With This Name and Number');
            }

        }
    };

    return (

        <LinearGradient
            colors={['#f2f2f2', '#f2f2f2', '#f2f2f2']}
            style={styles.container}
        >
            <Header headerTitle="Add Member"  pushRoute={() => router.replace('/(tabs)/home')} />
            <View style={styles.icons}>
                <FontAwesome style={{ marginBottom: 20 }} name="user-plus" size={70} color="#008080" />
            </View>
            <Text style={styles.title}>Add Committee Member</Text>
            <View style={styles.inputmain}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Member Name"
                    placeholderTextColor="#262626"

                    value={username}
                    onChangeText={setusername}
                />
                <FontAwesome style={{ position: "absolute", left: 10, top: 17 }} name="user-o" size={24} color="#008080" />
            </View>
            <View style={styles.inputmain}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Member Mobile Number"
                    placeholderTextColor="#262626"
                    keyboardType="numeric"
                    value={mobileNumber}
                    onChangeText={setmobileNumber}
                />
                <FontAwesome style={{ position: "absolute", left: 10, top: 17 }} name="phone-square" size={27} color="#008080" />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? <Loader /> : <Text style={styles.buttonText}>Add Member !</Text>}
            </TouchableOpacity>

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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        borderBottomWidth: 1,
        borderLeftWidth: 3,
        borderLeftColor: "rgba(255,255,255,0.6)",
        borderBottomColor: "rgba(255,255,255,0.6)",
        marginBottom: 20

    },
    logo: {
        width: 210,
        height: 210,
        objectFit: "contain"

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
        position: 'relative',
        height:65,
        marginBottom: 25,

    },
    input: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.02)',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0,0,0,0.02)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.03)',
        borderRadius: 3,
        
        color: '#000',
        backgroundColor: 'rgba(255,255,255,0.4)',
        paddingLeft: 39,
        
        height:60,
        letterSpacing:2,
        
        

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
        color: "#f2f2f2",
        textAlign: "center",
        letterSpacing: 2,
        fontSize:20


    },
});
