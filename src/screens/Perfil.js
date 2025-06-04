import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";

export default function Perfil() {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await SecureStore.getItemAsync("id_usuario");
        if (!id) return;

        const response = await api.getUserById(id);

        setUserData((prev) => ({
          ...prev,
          ...response.data.user,
        }));
      } catch (error) {
        console.log("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../../assets/senai.png")} style={styles.logo} />
      <View style={styles.avatar} />
      <TextInput
        style={styles.input}
        value={userData.nome}
        editable={false}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        value={userData.email}
        editable={false}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={userData.cpf}
        editable={false}
        placeholder="CPF"
      />
      <TextInput
        style={styles.input}
        value={userData.senha}
        editable={false}
        placeholder="Senha"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Modificar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Reservas")}
      >
        <Text style={styles.buttonText}>Minhas Reservas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 30,
  },
  input: {
    width: "90%",
    padding: 12,
    marginVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#b20000",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
