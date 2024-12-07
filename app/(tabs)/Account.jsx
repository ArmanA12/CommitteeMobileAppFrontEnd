import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter, useNavigation } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Payment() {

  const router = useRouter()



  return (
 
    <ScrollView showsVerticalScrollIndicator={false}>
       <View style={styles.container}>
      <Text style={{ fontSize: 33, color: "#404040", marginBottom: 2, marginTop: 40, letterSpacing: 3 }}>Account Books </Text>
      <Text style={{ fontSize: 16, color: "#404040", textAlign:"center", marginBottom: 8, marginTop: 10, letterSpacing: 1 }}>Here is the all information abount Account </Text>

      <View style={styles.paymentmain}>
        <View style={styles.paymentOption}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <LinearGradient
              style={styles.iconContainer}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="bookmarks-sharp" size={34} color="#f2f2f2" />
              </LinearGradient>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Member Monthly Payment Details</Text>
              <Text style={styles.subtitle}>View all details about member monthly payment</Text>
            </View>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => router.replace('/pages/allMemberMonthlyPaymentDetails')}>
            <LinearGradient
              style={styles.viewDetailsButton}
              colors={['#f2f2f2', '#f3f3f3', '#f1f1f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.viewDetailsText}>View Details <FontAwesome name="arrow-right" size={14} color="#404040" /></Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.paymentmain}>
        <View style={styles.paymentOption}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <LinearGradient
              style={styles.iconContainer}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="bookmarks-sharp" size={34} color="#f2f2f2" />
            </LinearGradient>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Hafiz Monthly Payment Details</Text>
              <Text style={styles.subtitle}>View all details about hafiz monthly payment</Text>
            </View>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => router.replace('/pages/hafizMonthlyPaymentDetails')}>
            <LinearGradient
              style={styles.viewDetailsButton}
              colors={['#f4f4f4', '#f3f3f3', '#f4f4f4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.viewDetailsText}>View Details <FontAwesome name="arrow-right" size={14} color="#404040" /></Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>



      <View style={styles.paymentmain}>
        <View style={styles.paymentOption}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <LinearGradient
              style={styles.iconContainer}
              colors={['#bfbfbf', '#008080', '#80d0c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="bookmarks-sharp" size={34} color="#f2f2f2" />
              </LinearGradient>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Others Payment Details</Text>
              <Text style={styles.subtitle}>View all details about hafiz monthly payment</Text>
            </View>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => router.replace('/pages/othersPyamentsDetails')}>
            <LinearGradient
              style={styles.viewDetailsButton}
              colors={['#f2f2f2', '#f3f3f3', '#f1f1f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.viewDetailsText}>View Details <FontAwesome name="arrow-right" size={14} color="#404040" /></Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

    </View>
    </ScrollView>
   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    width: "100%"
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",

  },
  textContainer: {
    maxWidth: "75%", // Set a max width to limit text overflow
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#595959",
    flexWrap: "wrap", // Ensure text wraps if it's too long
    letterSpacing: 2

  },
  subtitle: {
    fontSize: 15,
    color: "#808080",
    flexWrap: "wrap",
  },
  viewDetailsButton: {
    padding: 4,
    borderRadius: 1,
    paddingVertical: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: "rgba(0,0,0,0.1)"
  },
  viewDetailsText: {
    letterSpacing: 3,
    textAlign: "center",
    color: "#404040",
    width: "100%",

  },
  paymentOption: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.01)",

  },
  paymentmain: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    marginBottom: 10,
    borderRadius:4,
    borderWidth:1,
    borderColor:"rgba(0,0,0,0.02)"
  }
});
