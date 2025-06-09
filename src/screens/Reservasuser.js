import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";
import { MaterialIcons } from '@expo/vector-icons';

export default function MinhasReservas() {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [exclusaoSucesso, setExclusaoSucesso] = useState(false);

  useEffect(() => {
    buscarIdUsuario();
    if (idUsuario) {
      carregarReservas();
    }
  }, [idUsuario]);

  async function buscarIdUsuario() {
    const id = await SecureStore.getItemAsync("id_usuario");

    console.log("ID identificado: ", id);
    if (!id) {
      Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
      navigation.navigate("Login");
      return;
    }
    setIdUsuario(id);
  }
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authenticated');
    await SecureStore.deleteItemAsync('id_usuario');
    navigation.navigate('Login');
  };

  async function carregarReservas() {
    try {
      const response = await api.getReservaPorUsuario(idUsuario);
      setReservas(response.data.reservas);
      console.log("Sucesso...", response.data);
    } catch (error) {
      console.log("Erro ao buscar reservas:", error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  const excluirReserva = async (idReserva) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta reserva?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await api.deleteReserva(idReserva);
              setReservas((prev) =>
                prev.filter((reserva) => reserva.id_reserva !== idReserva)
              );
              Alert.alert("Sucesso", "Reserva excluída com sucesso!");
            } catch (error) {
              console.log("Erro ao excluir reserva:", error);
              Alert.alert("Erro", "Não foi possível excluir a reserva.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatarDataHora = (inicio, fim) => {
    const [dataInicio, horaInicio] = inicio.split("T");
    const [dataFim, horaFim] = fim.split("T");
    const dataFormatada = dataInicio.split("-").reverse().join("/");
    const horaInicioFormatada = horaInicio.slice(0, 5);
    const horaFimFormatada = horaFim.slice(0, 5);
    return `${dataFormatada} - ${horaInicioFormatada} até ${horaFimFormatada}`;
  };

  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <MaterialIcons name="logout" size={28} color="#b20000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>Minhas Reservas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#b71c1c" />
      ) : reservas.length > 0 ? (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id_reserva.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.sala}>Sala: {item.fk_id_sala}</Text>
              <Text style={styles.data}>
                {formatarDataHora(item.datahora_inicio, item.datahora_fim)}
              </Text>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirReserva(item.id_reserva)}
              >
                <Text style={styles.textoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.semReserva}>Nenhuma reserva encontrada.</Text>
      )}
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b71c1c",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  sala: {
    fontWeight: "bold",
    fontSize: 16,
  },
  data: {
    color: "#555",
    marginVertical: 4,
  },
  logoutIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  botaoExcluir: {
    marginTop: 8,
    backgroundColor: "#b71c1c",
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoExcluir: {
    color: "#fff",
    textAlign: "center",
  },
  semReserva: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
});
