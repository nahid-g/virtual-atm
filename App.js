import { useState, useEffect } from 'react';
import { Button, Modal, View, Text, TextInput, Alert, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './screens/HomeScreen';
import ATMOptions from './screens/ATMOptions';
import Transaction from './screens/Transaction';


const Stack = createNativeStackNavigator();
console.log(process.env['BASE_URL'])      
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomePage" component={HomeScreen} />
        <Stack.Screen name="Options" component={ATMOptions}  />
        <Stack.Screen name="Transaction" component={Transaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
