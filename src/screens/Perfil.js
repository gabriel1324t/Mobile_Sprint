import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import api from '../axios/axios';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
  });

  const navigation = useNavigation();

  useEffect(() => {
    async function carregarUsuario() {
      const id = await SecureStore.getItemAsync('id_usuario');
      if (!id) return;

      try {
        const response = await api.getUserById(id);
        const userData = response.data.user;
        console.log("Carregar Usuario...:", userData);

        setUsuario({
          nome: userData.nome,
          email: userData.email,
          cpf: userData.cpf,
          senha: '******',
        });
      } catch (error) {
        console.log('Erro ao buscar usuário:', error.response?.data?.error || error.message);
      }
    }

    carregarUsuario();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authenticated');
    await SecureStore.deleteItemAsync('id_usuario');
    navigation.navigate('Login');
  };

  const handleDeleteAccount = async () => {
    const id = await SecureStore.getItemAsync('id_usuario');
    if (!id) return;

    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Essa ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteUser(id);
              await SecureStore.deleteItemAsync('id_usuario');
              await SecureStore.deleteItemAsync('authenticated');
              Alert.alert('Conta excluída com sucesso.');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert('Erro ao excluir conta. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const UpdateUser = async () => {
    const id = await SecureStore.getItemAsync('id_usuario');
    if (!id) return;

    try {
      const payload = {
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        senha: usuario.senha !== '******' ? usuario.senha : undefined,
      };

      await api.updateUser(id, payload);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Ícone de logout */}
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <MaterialIcons name="logout" size={28} color="#b20000" />
      </TouchableOpacity>

      {/* Logo do Senai */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/senai.png')}
          style={styles.logo}
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <FontAwesome name="user-circle" size={100} color="#D9D9D9" />
      </View>

      <Text style={styles.title}>Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={usuario.nome}
        onChangeText={(text) => setUsuario({ ...usuario, nome: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={usuario.email}
        onChangeText={(text) => setUsuario({ ...usuario, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={usuario.cpf}
        //editable={false}
        onChangeText={(text) => setUsuario({ ...usuario, cpf: text })}
      />
       <TextInput
        style={styles.input}
        placeholder="Senha"
        value={usuario.senha}
        //editable={false}
        onChangeText={(text) => setUsuario({ ...usuario, senha: text })}
      />
   

      <TouchableOpacity style={styles.button} onPress={UpdateUser}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reservas')}>
        <Text style={styles.buttonText}>Minhas Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  logoutIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#b71c1c',
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#b20000',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
