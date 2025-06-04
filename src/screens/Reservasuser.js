import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import Layout from "../components/layout";
import api from "../axios/axios"; // usa o axios já configurado

export default function ReservaFormScreen() {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());

  useEffect(() => {
    const fetchSalaId = async () => {
      try {
        const id = await SecureStore.getItemAsync("id_usuario");
        if (!id) return;

        const response = await api.getAllReservaPorUsuario(id);

        setUserData((prev) => ({
          ...prev,
          ...response.data.user,
        }));
      } catch (error) {
        console.log("Erro ao buscar usuário:", error);
      }
    };

    fetchSalaId();
  }, []);

 
  const handleReserva = async () => {
    try {
      const fk_id_usuario = await SecureStore.getItemAsync("id_usuario");

      // Checa disponibilidade
      const disponibilidade = await api.post("/getHorariosReservados", {
        fk_id_sala: salaSelecionada,
        datahora_inicio: dataInicio,
        datahora_fim: dataFim,
      });

      if (!disponibilidade.data.available) {
        return Alert.alert(
          "Erro",
          "Essa sala já está reservada nesse horário."
        );
      }

      // Cria reserva
      await api.post("/createReservas", {
        fk_id_usuario,
        fk_id_sala: salaSelecionada,
        datahora_inicio: dataInicio,
        datahora_fim: dataFim,
      });

      Alert.alert("Sucesso", "Reserva feita com sucesso!");
    } catch (error) {
      console.error("Erro ao reservar:", error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer a reserva.");
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Selecione a sala:</Text>
        {salas.map((sala) => (
          <TouchableOpacity
            key={sala.id_sala}
            style={[
              styles.salaButton,
              salaSelecionada === sala.id_sala && styles.salaSelecionada,
            ]}
            onPress={() => setSalaSelecionada(sala.id_sala)}
          >
            <Text>{sala.nome}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Data e hora de início:</Text>
        <DateTimePicker
          value={dataInicio}
          mode="datetime"
          onChange={(event, selectedDate) =>
            selectedDate && setDataInicio(selectedDate)
          }
        />

        <Text style={styles.label}>Data e hora de fim:</Text>
        <DateTimePicker
          value={dataFim}
          mode="datetime"
          onChange={(event, selectedDate) =>
            selectedDate && setDataFim(selectedDate)
          }
        />

        <TouchableOpacity style={styles.button} onPress={handleReserva}>
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  salaButton: {
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 8,
  },
  salaSelecionada: {
    backgroundColor: "#b20000",
    color: "#fff",
  },
  button: {
    backgroundColor: "#b20000",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
