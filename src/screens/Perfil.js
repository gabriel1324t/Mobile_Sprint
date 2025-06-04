import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import api from '../axios/axios';

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

        setUsuario({
          nome: userData.nome || '',
          email: userData.email || '',
          cpf: userData.cpf || '',
          senha: '******', // senha oculta
        });
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    }

    carregarUsuario();
  }, []);

  const handleDeleteAccount = async () => {
    const id = await SecureStore.getItemAsync('id_usuario');
    if (!id) return;

    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Essa ação é irreversível.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={usuario.nome}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={usuario.email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={usuario.cpf}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={usuario.senha}
        secureTextEntry
        editable={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Reservas')}
      >
        <Text style={styles.buttonText}>Minhas Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#8c0000' }]}
        onPress={handleDeleteAccount}
      >
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
    justifyContent: 'center',
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
