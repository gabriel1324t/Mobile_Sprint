import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";

//import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import ListaSalas from "./ListaSalas";
import Layout from "../components/layout";

export default function Perfil() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    id: null,
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  async function saveToken(token) {
    await SecureStore.setItemAsync("token", token);
  }

  async function handleUsuario() {
    try {
      const response = await api.postLogin(form);
      const usuario = response.data.usuario;

      await saveToken(response.data.token);
      setForm({
        ...form,
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        senha: "", // limpa a senha por segurança
      });

      Alert.alert("Bem-vindo!", response.data.message);
      navigation.navigate("ListaSalas", { usuario });
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.error || "Falha na requisição");
    }
  }

  const handleMinhasReservas = async () => {
    try {
      if (!form.id) {
        return Alert.alert("Erro", "Usuário não está logado");
      }

      const response = await api.getReservaPorUsuario(form.id);
      const reservas = response.data;

      navigation.navigate("Reservas", { reservas });
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas reservas.");
    }
  };

  return (
    <Layout>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome:"
        value={form.nome}
        onChangeText={(v) => handleChange("nome", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email:"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF:"
        value={form.cpf}
        onChangeText={(v) => handleChange("cpf", v)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha:"
        value={form.senha}
        onChangeText={(v) => handleChange("senha", v)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleUsuario}>
        <Text style={styles.buttonText}>Modificar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleMinhasReservas} style={styles.button}>
        <Text style={styles.buttonText}>Minhas Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ListaSalas",{ user: form })}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      
    </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "600",
    marginBottom: 4,
    color: "#555",
  },
  button: {
    width: "100%",
    height: 44,
    backgroundColor: "#b30000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  iconButton: {
    position: "absolute",
    top: 24,
    right: 24,
  },
});
