import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./screens/Login";
import Cadastro from './screens/Cadastro';
import ListaSalas from './screens/ListaSalas';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="ListaSalas" component={ListaSalas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}