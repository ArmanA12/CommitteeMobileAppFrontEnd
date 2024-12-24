import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";

export default function RootLayout() {
  useFonts({
    "MartianMono_Condensed-ExtraBold": require('../assets/fonts/MartianMono_Condensed-ExtraBold.ttf'),
    "Cairo-SemiBold": require('../assets/fonts/Cairo-SemiBold.ttf')
  });

  return (
    <>
      <StatusBar backgroundColor="#f2f2f2" barStyle="light-content" />
      <Stack>
        <Stack.Screen options={{ headerShown: false }} name="index" />
      </Stack>
    </>
  );
}
