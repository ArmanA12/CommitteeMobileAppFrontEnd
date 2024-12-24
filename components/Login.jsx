import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Imagelogo from '../assets/images/download-removebg-preview.png';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Loader from './Loader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

export default function Login() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const logoPosition = useSharedValue(-300);
    const namePosition = useSharedValue(300);
    const numberPosition = useSharedValue(300);
    const buttonPosition = useSharedValue(300);

    useEffect(() => {
        logoPosition.value = withTiming(0, { duration: 500 });
        namePosition.value = withDelay(300, withTiming(0, { duration: 800 }));
        numberPosition.value = withDelay(600, withTiming(0, { duration: 1000 }));
        buttonPosition.value = withDelay(900, withTiming(0, { duration: 1200 }));

        navigation.setOptions({ headerShown: false });
        

        const isUserAvailable = async () => {

            const token = await AsyncStorage.getItem('auth');
            const tokenData = token ? JSON.parse(token) : null;
            if(tokenData){
                setTimeout(() => {
                    router.replace('/pages/lockScreen');
                }, 4000);
             }
 
        };
        isUserAvailable();
    }, []);

    const validateForm = () => {
        if (name.trim() === '') {
            setError('Please enter your name.');
            return false;
        } else if (number.trim() === '' || number.length !== 10 || isNaN(number)) {
            setError('Please enter a valid 10-digit number.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {

                const res = await axios.post('https://committee-mobile-app-backend.vercel.app/api/v1/auth/login', { number });
                await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                await AsyncStorage.setItem('auth', "1");
                router.replace('/pages/lockScreen');
            } catch (error) {
                setLoading(false);
                if (error.response) {
                    if (error.response.status === 404) {
                        Alert.alert('Error', 'You are not a member.');
                    } else {
                        Alert.alert('Error', 'Failed to login');
                    }
                } else {
                    Alert.alert('Error', 'An unexpected error occurred');
                }
                console.error('Error:', error);
            }
        }
    };

    const logoAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: logoPosition.value }],
        };
    });

    const nameAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: namePosition.value }],
        };
    });

    const numberAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: numberPosition.value }],
        };
    });

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: buttonPosition.value }],
        };
    });

    return (
        <LinearGradient colors={['#f2f2f2', '#f2f2f2', '#efeff5']} style={styles.container}>
            <Animated.Image source={Imagelogo} style={[styles.logo, logoAnimatedStyle]} />
            <Text style={styles.title}>Welcome! to KKS Committee</Text>
            <Animated.View style={[styles.inputmain, nameAnimatedStyle]}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#262626"
                    value={name}
                    onChangeText={setName}
                />
                <FontAwesome style={{ position: 'absolute', left: 10, top: 17 }} name="user-o" size={24} color="#008080" />
            </Animated.View>
            <Animated.View style={[styles.inputmain, numberAnimatedStyle]}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your number"
                    placeholderTextColor="#262626"
                    keyboardType="numeric"
                    value={number}
                    onChangeText={setNumber}
                />
                <FontAwesome style={{ position: 'absolute', left: 10, top: 17 }} name="phone-square" size={27} color="#008080" />
            </Animated.View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? <Loader /> : <Text style={styles.buttonText}>Please Enter <MaterialCommunityIcons name="arrow-top-right" size={24} color="#f2f2f2" /></Text>}
                </TouchableOpacity>
            </Animated.View>
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
        width: '100%',
    },
    logo: {
        width: 210,
        height: 210,
        objectFit: 'contain',
        marginBottom: 1,
    },
    title: {
        fontSize: 24,
        color: '#008080',
        marginBottom: 20,
        fontWeight: 'bold',
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
        backgroundColor: 'rgba(255,255,255,0.3)',
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
        borderRadius: 50,
        paddingVertical:15,
        paddingHorizontal:45,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 19,
        letterSpacing: 3,
    },
});
