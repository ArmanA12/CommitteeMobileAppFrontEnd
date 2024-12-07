import { View, Text, StyleSheet, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import qrcode from '../../assets/images/qrcode.png'
import onlinePay from '../../assets/images/online-payment.jpg'

import { TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'




export default function Payment() {

  const [copyState, setcopyState] = useState(false);
  const [copyUPI, setcopyUPI] = useState(false);
  const router = useRouter()

  const copyToClickBate = async (text) => {
    await Clipboard.setStringAsync(text);
    if (text === "7091554628") {
      setcopyState(true);
    }
    else {
      setcopyUPI(true);
    }
  }
  if (copyState) {
    setTimeout(() => {
      setcopyState(false);
    }, 2000);
  }

  if (copyUPI) {
    setTimeout(() => {
      setcopyUPI(false);
    }, 2000);
  }




  const downloadQrCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status === 'granted') {
        const fileUri = FileSystem.documentDirectory + 'qrcode.jpg'
        await FileSystem.downloadAsync(
          Image.resolveAssetSource(qrcode).uri,
          fileUri
        )
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync('Download', asset, false)
        Alert.alert('Success', 'QR code saved to your gallery.')
      } else {
        Alert.alert('Permission Denied', 'Unable to save image without permission.')
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to download the QR code.')
    }
  }



  return (

    <View style={styles.container}>
      <Text style={{ fontSize: 26, letterSpacing: 2, color: "#404040", marginTop: 50, marginBottom: 1, textAlign: "center" }}>Online Payment Options</Text>
      <Text style={{ fontSize: 16, letterSpacing: 2, color: "#404040", marginTop: 5, marginBottom: 10, textAlign: "center" }}>Here is the Payment Options</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
        <View style={styles.downloadqr}>
          <Image source={qrcode} style={styles.qrcode} />
          <TouchableOpacity onPress={() => downloadQrCode()}>
            <LinearGradient
              style={{ padding: 4, borderRadius: 1 }}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >

              <View style={styles.downloadqrcode}>
                <Text style={{ textAlign: "center", fontSize: 17, letterSpacing: 2, color: "#f2f2f2" }}>Download <FontAwesome name="arrow-down" size={16} color="#f2f2f2" /></Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.downloadqr}>
          <Image source={onlinePay} style={styles.qrcode} />
          <TouchableOpacity onPress={() => downloadQrCode()}>
            <LinearGradient
              style={{ padding: 4, borderRadius: 1 }}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >

              <View style={styles.downloadqrcode}>
                <Text style={{ textAlign: "center", fontSize: 17, letterSpacing: 2, color: "#f2f2f2" }}>PAY ONLINE</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
      <Text>&nbsp;</Text>
      <View style={styles.paymentOption}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }}>
            <FontAwesome name="rupee" size={30} color="black" />
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#404040" }}>GPAY</Text>
            <Text style={{ fontSize: 15, color: "#404040" }}>7091554628</Text>
          </View>

        </View>
        <View>
          <TouchableOpacity onPress={() => copyToClickBate("7091554628")}>
            <LinearGradient
              style={{ padding: 4, borderRadius: 1, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 50 }}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={{ letterSpacing: 3, color: "#f2f2f2" }}>{
                copyState ? <Text>Copied</Text> : <Text>Copy</Text>
              }</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.paymentOption}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }}>
            <FontAwesome name="rupee" size={30} color="black" />
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#404040" }}>UPI</Text>
            <Text style={{ fontSize: 15, color: "#404040" }}>mdarmanshekh4@oksbi</Text>
          </View>

        </View>
        <View>
          <TouchableOpacity onPress={() => copyToClickBate("mdarmanshekh4@oksbi")}>
            <LinearGradient
              style={{ padding: 4, borderRadius: 1, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 50 }}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={{ letterSpacing: 3, color: "#f2f2f2" }}>{
                copyUPI ? <Text>Copied</Text> : <Text>Copy</Text>
              }</Text>
            </LinearGradient>

          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.paymentOption}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }}>
            <LinearGradient
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="users" size={30} color="#f2f2f2" />
            </LinearGradient>
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#404040" }}>Add Member Payment
            </Text>
          </View>

        </View>
        <TouchableOpacity onPress={() => router.replace('/pages/addMemberMonthlyPayment')}>
          <View>
            <Text style={{ letterSpacing: 3, color: "#404040", backgroundColor: "rgba(0,0,0,0.1)", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 50 }}>ADD</Text>
          </View>

        </TouchableOpacity>
      </View>


      <View style={styles.paymentOption}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }}>
            <LinearGradient
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="user" size={30} color="#f2f2f2" />
            </LinearGradient>
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#404040" }}>Add Hafiz-G Payment

            </Text>
          </View>

        </View>
        <TouchableOpacity onPress={() => router.replace('/pages/addHafizMonthlyPayment')}>
          <View>
            <Text style={{ letterSpacing: 3, color: "#404040", backgroundColor: "rgba(0,0,0,0.1)", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 50 }}>ADD</Text>
          </View>

        </TouchableOpacity>
      </View>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Ivory background color
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    width: "100%"
  },
  qrcode: {
    width: 150,
    height: 140,
    objectFit: "fill",
  },
  downloadqrcode: {
    padding: 8,
  },
  downloadqr: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 2,
    borderRadius: 2
  },
  paymentOption: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)"
  }
})