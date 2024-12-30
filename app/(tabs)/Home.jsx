import { View, Text, TouchableOpacity, StyleSheet ,StatusBar} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CurrentStatus from '../../components/CurrentStatus';
import { BlurView } from 'expo-blur';
import PaymentSpeek from '../../components/PaymentSpeek';
import { membersAmountCalculator, hafizAmountCalculator, getAllCommitteMember } from '../../api/api';
import Feather from '@expo/vector-icons/Feather';


export default function Home() {

  const navigation = useNavigation();
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalHafizAmout, settotalHafizAmout] = useState(0);
  const [totalMember, settotalMember] = useState(0)


  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const amountFetcher = async () => {
      const res = await membersAmountCalculator();
      const hafizres = await hafizAmountCalculator();
      const memberCount = await getAllCommitteMember();
      if (res) {
        setTotalAmount(res);
        settotalHafizAmout(hafizres)
        settotalMember(memberCount.length)
      }
    };
    amountFetcher();
  }, []);




  return (

    <View style={styles.container}>
            <StatusBar
        barStyle="light-content" 
        backgroundColor="#008080" 
        translucent={false} 
      />


      <View>
        <PaymentSpeek />

      </View>
      <View style={styles.mainContiner}>
        <View style={{}}>
          <LinearGradient
            style={{ paddingHorizontal: 10 }}
            colors={['#008080', '#e0e0eb']}

          >
            <View style={{backgroundColor:"rgba(255,255,255,0.1)", width:90, textAlign:"center", position:"absolute", zIndex:1, top:15, left:10, borderTopRightRadius:15, borderTopLeftRadius:10, borderLeftWidth:1, borderLeftColor:"rgba(255,255,255,0.3)",
              borderTopWidth:1, borderTopColor:"rgba(255,255,255,0.3)",
              borderRightWidth:1, borderRightColor:"rgba(255,255,255,0.3)"
            }}>
              <Text style={{fontWeight:900, textAlign:"center", letterSpacing:5,paddingVertical:3,color: "rgba(255,255,255,0.8)"}}>786</Text>
            </View>
            <BlurView intensity={7} tint="light" style={styles.blurContainer}>

              <Text style={styles.kalma}><Text style={{ fontFamily: "MartianMono_Condensed-ExtraBold",}}>لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَّسُولُ ٱللَّٰهِ</Text></Text>

              <View

                style={styles.amoutContainer}>

                <View>
                  <Text style={styles.rupeee}><Text style={{ fontFamily: "Cairo-SemiBold" }}>₹</Text></Text>
                </View>


                <View>

                  <Text style={styles.totalAmount}>
                    <Text style={{fontFamily: "MartianMono_Condensed-ExtraBold",  letterSpacing: 3 }}>{totalAmount}</Text>
                  </Text>
                  <Text style={styles.totatext}><Text style={{ fontFamily: "Cairo-SemiBold" }}>Total Amount</Text></Text>
                </View>
              </View>
            </BlurView>
            <View style={{marginTop:8}}>
            <CurrentStatus />
            </View>
            <View style={{height:45}}></View>
          </LinearGradient>
        </View>

        <View style={{height:45}}></View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 20, letterSpacing: 3, color: "#b3b3b3", marginLeft: 10 }}>Account Card*</Text>
          <View style={styles.amountDetails}>
            <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 20, letterSpacing: 3, color: "#008080" }}>Current Balance</Text>
            <Text style={{ fontSize: 45, color: "#737373", letterSpacing: 2 }}>₹ {totalAmount - totalHafizAmout}.<Text style={{ color: "#b3b3b3" }}>00</Text></Text>
            <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 13, color: "#737373", marginTop: 8, letterSpacing: 1 }}>Expense on Hafi-G</Text>
            <Text style={{ fontSize: 18, color: "#737373", letterSpacing: 2 }}>₹ {totalHafizAmout}.<Text style={{ color: "#b3b3b3" }}>000</Text></Text>
            <View style={styles.right}>
              <FontAwesome name="angle-double-right" size={22} color="#737373" />
            </View>
          </View>
        </View>
        <View style={styles.memberandrules}>
        <LinearGradient
            style={{ padding: 4, borderRadius: 100, width: 60, height:60, borderWidth: 1, borderColor: "rgba(0,0,0,0.01)",flexDirection:"row", justifyContent:"center", alignItems:"center", borderStyle:"dashed" }}
            colors={['#f1f1f1', '#f1f1f1', '#e0e0eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity onPress={() => router.replace('/pages/membersCurrentmonthPayStatus')}>
              <View style={styles.rulesbox}>
                <FontAwesome name="users" size={27} color="#008080" />                
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={{ padding: 4, borderRadius: 100, width: 60, height:60, borderWidth: 2, borderColor: "rgba(255,255,255,0.5)",flexDirection:"row", justifyContent:"center", alignItems:"center" }}
            colors={['#008080', '#008080', '#008080']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}

          >
            <TouchableOpacity onPress={() => router.replace('/pages/addMember')}>
            <View style={styles.rulesbox}>
            <Feather name="plus" size={27} color="#f2f2f2" />
            </View>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={{ padding: 4, borderRadius: 100, width: 60, height:60, borderWidth: 1, borderColor: "rgba(0,0,0,0.01)",flexDirection:"row", justifyContent:"center", alignItems:"center", borderStyle:"dashed" }}
            colors={['#f1f1f1', '#f1f1f1', '#e0e0eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}

          >
            <TouchableOpacity onPress={() => router.replace('/pages/rulesAndRegulation')}>
              <View style={styles.rulesbox}>
                <FontAwesome name="legal" size={27} color="#008080" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  blurContainer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.2)",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
    paddingVertical:20,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderTopRightRadius:10



  },
  amoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    borderRadius: 100,
    position: "relative",
    marginTop: -10
  },
  rulesbox: {
    paddingHorizontal: 5,
    paddingVertical: 10,

  },
  rupeee: {
    fontSize: 100,
    fontWeight: "900",
    color: "rgba(255,255,255,0.8)",
    textShadowColor: '#006666',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,

  },
  totalAmount: {
    fontSize: 50,
    fontWeight: "800",
    color: "rgba(255,255,255,0.8)",
    textShadowColor: '#006666',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  totatext: {
    fontSize: 20,
    fontWeight: "900",
    color: "rgba(255,255,255,0.8)",
    textShadowColor: '#006666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 10,
    letterSpacing: 3
  },
  kalma: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "900",
    color: "rgba(255,255,255,0.8)",
    textShadowColor: '#006666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 10,
    letterSpacing: 6,
  
  },
  memberandrules: {
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    gap: 5,
    marginTop:8,
    position:"absolute",
    top:345,
  },
  amountDetails: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderColor: "rgba(0,0,0,0.2)",
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderStyle: 'dashed',
  },
  right: {
    position: "absolute",
    bottom: 15,
    right: 20,
    color: "#737373"
  }

}) 
