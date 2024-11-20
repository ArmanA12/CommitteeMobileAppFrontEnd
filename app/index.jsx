import { Text, View } from "react-native";
import Login from '../components/Login'
import { useRouter } from "expo-router";

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Login />
    </View>
  );
}
