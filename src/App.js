import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./screens/Login";
import Cadastro from './screens/Cadastro';
import ListaSalas from './screens/ListaSalas';
import Perfil from "./screens/Perfil";
import Reservas from './screens/Reservasuser'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="ListaSalas" component={ListaSalas} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Reservas" component={Reservas}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
