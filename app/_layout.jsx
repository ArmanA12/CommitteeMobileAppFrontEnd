import { Stack } from "expo-router";
import { useFonts } from "expo-font";
export default function RootLayout() {

  useFonts({
    "MartianMono_Condensed-ExtraBold": require('../assets/fonts/MartianMono_Condensed-ExtraBold.ttf'),
    "Cairo-SemiBold": require('../assets/fonts/Cairo-SemiBold.ttf')

  })


  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="index" />
    </Stack>
  );
}
