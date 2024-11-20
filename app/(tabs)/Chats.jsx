import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import App from '../../components/ChatScreen'

export default function Chats() {
  return (
    <GestureHandlerRootView>
        <App />
    </GestureHandlerRootView>
  )
}