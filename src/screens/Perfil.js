import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../axios/axios";
import * as SecureStore from "expo-secure-store";

export default function PerfilUsuario() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  async function carregarDadosUsuario() {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        return;
      }

      const response = await api.getUsuario(userId);
      const usuario = response.data.user;

      setName(usuario.nome || "");
      setCpf(usuario.cpf || "");
      setEmail(usuario.email || "");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      console.log("Erro ao carregar usuário:", error);
    }
  }

  async function handleUpdate() {
    if (!nome || !email) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const dadosAtualizados = {
        nome,
        email,
      };

      // Só manda a senha se o usuário preencher o campo
      if (senha) {
        dadosAtualizados.senha = senha;
      }

      const id_usuario = await SecureStore.getItemAsync("id_usuario");
      if (!id_usuario) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        return;
      }

      const response = await api.updateUser(id_usuario, dadosAtualizados);

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setPassword("");
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MEU PERFIL</Text>

      <View style={styles.avatarContainer}>
        <Icon name="person" size={80} color="#f88" />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          editable={true}
        />

        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={cpf}
          editable={false}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={true}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          editable={true}
          placeholder="Digite sua nova senha"
          secureTextEntry
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleUpdate}>
          <Text style={styles.botaoTexto}>Atualizar Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
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
