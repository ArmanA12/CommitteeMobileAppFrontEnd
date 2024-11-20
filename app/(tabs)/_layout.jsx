import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';




export default function TabLayout() {

  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });


  return (
    <Tabs
      screenOptions={{

        tabBarActiveTintColor: '#008080',
        tabBarStyle: {
          backgroundColor: '#f2f2f2',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
          elevation: 0
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Madarsa"
        options={{
          title: 'Madarsa',
          tabBarIcon: ({ color }) => <FontAwesome5 name="mosque" size={21} color={color} />,
        }}
      />
            <Tabs.Screen
        name="Chats"
        options={{
          headerShown:false,
          title: 'Chats',
          tabBarIcon: ({ color }) =><Ionicons name="chatbubble-ellipses-outline" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="Payment"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color }) => <FontAwesome5 name="amazon-pay" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Entypo name="folder" size={24} color={color} />,
        }}
      />
    </Tabs>

  );
}