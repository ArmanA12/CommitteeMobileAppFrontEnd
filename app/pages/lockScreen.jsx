import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ProgressBarAndroid, AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  cancelAnimation,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';

export default function FingerprintAuth() {
    const navigation = useNavigation();
    const router = useRouter();
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    const createRingValues = () => ({
        scale: useSharedValue(1),
        opacity: useSharedValue(0.8)
    });

    const outerRings = [createRingValues(), createRingValues(), createRingValues()];
    const middleRings = [createRingValues(), createRingValues(), createRingValues()];
    const innerRings = [createRingValues(), createRingValues(), createRingValues()];

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        const checkForBiometrics = async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setIsBiometricSupported(compatible && enrolled);
        };

        checkForBiometrics();
        startAnimations();

        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                startAnimations(); 
            }
        });

        return () => {
            
            [...outerRings, ...middleRings, ...innerRings].forEach(ring => {
                cancelAnimation(ring.scale);
                cancelAnimation(ring.opacity);
            });
            subscription.remove();
        };
    }, []);

    const createRingAnimation = (ring, duration, delay, maxScale) => {
        const easing = Easing.bezier(0.25, 0.1, 0.25, 1);
        ring.scale.value = withDelay(
            delay,
            withRepeat(
                withTiming(maxScale, {
                    duration,
                    easing,
                }, () => {
                    ring.scale.value = 1;
                }),
                -1,
                false
            )
        );

        
        ring.opacity.value = withDelay(
            delay,
            withRepeat(
                withTiming(0, {
                    duration,
                    easing,
                }, () => {
                    ring.opacity.value = 0.8;
                }),
                -1,
                false
            )
        );
    };

    const startAnimations = () => {
        const baseDuration = 3000;
        
        // Animate outer rings
        outerRings.forEach((ring, index) => {
            createRingAnimation(
                ring,
                baseDuration,
                index * (baseDuration / 3),
                1.4
            );
        });

        // Animate middle rings
        middleRings.forEach((ring, index) => {
            createRingAnimation(
                ring,
                baseDuration * 0.9,
                (index * (baseDuration / 3)) + 200,
                1.3
            );
        });

        // Animate inner rings
        innerRings.forEach((ring, index) => {
            createRingAnimation(
                ring,
                baseDuration * 0.8,
                (index * (baseDuration / 3)) + 400,
                1.2
            );
        });
    };

    const handleAuthentication = async () => {
        if (!isBiometricSupported) {
            Alert.alert('Biometric authentication is not supported on this device.');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate',
            fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
            router.replace('(tabs)/Home');
            
        } else {
            Alert.alert('Authentication failed. Please try again.');
        }
    };
    const createRingStyle = (ring) => 
        useAnimatedStyle(() => ({
            transform: [{ scale: ring.scale.value }],
            opacity: ring.opacity.value,
        }));

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Use Fingerprint</Text>
            <View style={styles.one}>
                {outerRings.map((ring, index) => (
                    <Animated.View
                        key={`outer-${index}`}
                        style={[styles.animatedRing, styles.outerRing, createRingStyle(ring)]}
                    />
                ))}
                
                <View style={styles.three}>
            
                    {middleRings.map((ring, index) => (
                        <Animated.View
                            key={`middle-${index}`}
                            style={[styles.animatedRing, styles.middleRing, createRingStyle(ring)]}
                        />
                    ))}
                    
                    <View style={styles.four}>
                    
                        {innerRings.map((ring, index) => (
                            <Animated.View
                                key={`inner-${index}`}
                                style={[styles.animatedRing, styles.innerRing, createRingStyle(ring)]}
                            />
                        ))}
                        
                        <TouchableOpacity onPress={handleAuthentication}>
                            <MaterialCommunityIcons name="fingerprint" size={90} color="#008080" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.progressMain}>
            <View style={styles.progressDiv} />
        </View>

            <Text style={styles.scanningText}>Scanning...</Text>
            <Text style={styles.instructionText}>
                Put your finger on fingerprint button and rotate it slowly
            </Text>
            <TouchableOpacity
                style={styles.passwordButton}
                onPress={handleAuthentication}
            >
                <Text style={styles.passwordButtonText}>Use Lock Password <AntDesign name="lock" size={20} color="#f2f2f2" /></Text>
            </TouchableOpacity>

            <LinearGradient
                style={styles.gradient}
                colors={['#f2f2f2', '#f2f2f2', '#f2f2f2']}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#f2f2f2',
        position: "relative"
    },
    headerText: {
        textAlign: "center",
        letterSpacing: 3,
        fontSize: 20,
        color: "#008080",
        marginTop: 30,
        marginBottom: 40
    },
    one: {
        width: 220,
        height: 220,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    animatedRing: {
        position: 'absolute',
        borderStyle: 'dashed',
        borderColor: '#008080',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    outerRing: {
        width: '100%',
        height: '100%',
        borderRadius: 110,
        borderWidth: 1.5,
    },
    three: {
        width: 175,
        height: 175,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    middleRing: {
        width: 175,
        height: 175,
        borderRadius: 87.5,
        borderWidth: 1.25,
    },
    four: {
        width: 125,
        height: 125,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    innerRing: {
        width: 125,
        height: 125,
        borderRadius: 62.5,
        borderWidth: 1,
    },
    scanningText: {
        color: "rgba(0,0,0,0.3)",
        letterSpacing: 2,
        marginTop: 6
    },
    instructionText: {
        color: "#a6a6a6",
        letterSpacing: 2,
        marginTop: 20,
        textAlign: "center",
        paddingHorizontal: 30
    },
    passwordButton: {
        width: "80%",
        backgroundColor: "#008080",
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginTop: 40,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    passwordButtonText: {
        color: "#f2f2f2",
        textAlign: "center",
        letterSpacing: 2,
        fontSize:16

    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
    },
    progressMain: {
        width: '65%', // Full width of the parent container
        height: 6, // Height of the progress bar
        backgroundColor: 'rgba(0,0,0,0.04)', // Gray background for the unfilled part
        borderRadius: 10, // Rounded corners
        overflow: 'hidden', // Ensure child does not overflow
        marginTop:40
    },
    progressDiv: {
        width: '60%', // 50% filled
        height: '100%', // Full height of the parent
        backgroundColor: '#008080', // Green color for the filled part
    },

});
