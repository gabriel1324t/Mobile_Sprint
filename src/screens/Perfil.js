import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, TextInput } from 'react-native';
import Avatar from '../components/Avatar';
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";

export default function Perfil() {
  const navigation = useNavigation();

  const [form, setForm] = useState({ nome: '', email: '', cpf: '', senha: '' });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  async function handleUsuario() {
    await api.postLogin(form).then(
      (response) => {
        saveToken(response.data.token); // Defina ou importe essa função
        Alert.alert("OK", response.data.message);
        navigation.navigate("ListaSalas", { usuario: response.data.usuario });
      },
      (error) => {
        console.log(error.response.data);
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <Avatar />

      <TextInput
        style={styles.input}
        placeholder="Nome:"
        value={form.nome}
        onChangeText={(v) => handleChange('nome', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email:"
        value={form.email}
        onChangeText={(v) => handleChange('email', v)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF:"
        value={form.cpf}
        onChangeText={(v) => handleChange('cpf', v)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha:"
        value={form.senha}
        onChangeText={(v) => handleChange('senha', v)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Modificar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ListaSalas")} style={styles.button}>
        <Text style={styles.buttonText}>Ir para ListaSalas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUsuario} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#b71c1c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff' },
});
