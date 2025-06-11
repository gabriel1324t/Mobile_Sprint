import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Layout from "../components/layout";
import api from "../axios/axios";
import DateTimePicker from "../components/DateTimePicker";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";

export default function ListaSalas({ route }) {
  const { user } = route.params;
  const [salas, setSalas] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [busca, setBusca] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [reservasSala, setReservasSala] = useState([]);

  const [novaReserva, setNovaReserva] = useState({
    datahora_inicio: null,
    datahora_fim: null,
    fk_id_usuario: "",
    fk_id_sala: "",
  });

  const buscarSala = () => {
    const filtradas = salas.filter((sala) =>
      sala.numero.toLowerCase().includes(busca.toLowerCase())
    );
    setResultado(filtradas);
  };

  const formatDateForMySQL = (date) => {
    return date.toISOString().replace("T", " ").replace("Z", "").split(".")[0];
  };

  async function criarReserva() {
    try {
      // Clona e converte as datas para strings ISO para enviar para a API
      console.log(novaReserva);

      const id_usuario = await SecureStore.getItemAsync("id_usuario");
      const reservaParaEnviar = {
        ...novaReserva,
        fk_id_usuario: id_usuario,
        datahora_inicio: formatDateForMySQL(novaReserva.datahora_inicio),
        datahora_fim: formatDateForMySQL(novaReserva.datahora_fim),
      };

      const response = await api.createReserva(reservaParaEnviar);

      Alert.alert("Sucesso", response.data.message);

      // Reseta o estado da nova reserva com datas null
      setNovaReserva({
        datahora_inicio: null,
        datahora_fim: null,
        fk_id_usuario: "",
        fk_id_sala: "",
      });
      setMostrarForm(false);

      abrirModalComDescricao(salaSelecionada);
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message;

      if (errMsg.includes("bloqueado")) {
        Alert.alert(
          "Acesso negado",
          "Você está bloqueado e não pode fazer reservas."
        );
      } else {
        Alert.alert("Erro", errMsg);
      }

      console.log("Erro ao criar reserva:", errMsg);
    }
  }

  useEffect(() => {
    fetchSalas();
  }, []);

  async function fetchSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.sala || []);
    } catch (error) {
      console.log("Erro ao buscar salas:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function abrirModalComDescricao(sala) {
    setSalaSelecionada(sala);
    setModalVisible(true);

    setNovaReserva((prev) => ({
      ...prev,
      fk_id_usuario: user.id_usuario,
      fk_id_sala: sala.id_sala,
    }));

    try {
      const response = await api.getAllReservasPorSala(sala.id_sala);
      const reservas = response.data.reservas || [];
      setReservasSala(reservas);
    } catch (error) {
      console.log(
        "Erro ao buscar reservas da sala:",
        error?.response?.data?.message || error.message
      );
      setReservasSala([]);
    }
  }

  function fecharModal() {
    setModalVisible(false);
    setSalaSelecionada(null);
    setReservasSala([]);
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Salas:</Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar por número da sala"
            value={busca}
            onChangeText={setBusca}
          />

          <TouchableOpacity style={styles.botao} onPress={buscarSala}>
            <Text style={styles.botaoTexto}>Buscar</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              data={resultado.length > 0 ? resultado : salas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.salaButton}
                  onPress={() => abrirModalComDescricao(item)}
                >
                  <Text style={styles.salaButtonText}>{item.numero}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>Nenhuma sala encontrada.</Text>}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        <Modal
          visible={modalVisible}
          onRequestClose={fecharModal}
          animationType="slide"
        >
          <ScrollView
            contentContainerStyle={styles.modalContainer}
            keyboardShouldPersistTaps="handled"
          >
            {salaSelecionada ? (
              <>
                <Image
                  source={require("../../assets/senai.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <Text style={styles.salaNumeroModal}>
                  {salaSelecionada.numero}
                </Text>

                <View style={styles.modalContent}>
                  <Text style={styles.sectionTitle}>Descrição:</Text>
                  <Text style={styles.descriptionText}>
                    {salaSelecionada.descricao}
                  </Text>

                  <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                    Capacidade:
                  </Text>
                  <Text style={styles.descriptionText}>
                    Máxima: {salaSelecionada.capacidade} alunos
                  </Text>

                  <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                    Reservas:
                  </Text>
                  {reservasSala.length > 0 ? (
                    reservasSala.map((reserva, index) => (
                      <Text key={index} style={styles.descriptionText}>
                        Início: {formatarData(reserva.datahora_inicio)}
                        {"\n"}
                        Fim: {formatarData(reserva.datahora_fim)}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.descriptionText}>
                      Nenhuma reserva encontrada.
                    </Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      { backgroundColor: "#B30E0A", marginTop: 20 },
                    ]}
                    onPress={() => setMostrarForm(!mostrarForm)}
                  >
                    <Text style={{ color: "white" }}>
                      {mostrarForm ? "Cancelar" : "Criar nova reserva"}
                    </Text>
                  </TouchableOpacity>

                  {mostrarForm && (
                    <View style={{ marginTop: 20 }}>
                      <Text>Data e hora de início:</Text>
                      <DateTimePicker
                        type="datetime"
                        buttonTitle="Selecione a data de início"
                        setValue={setNovaReserva}
                        dateKey="datahora_inicio"
                        currentValue={novaReserva.datahora_inicio}
                      />

                      <DateTimePicker
                        type="datetime"
                        buttonTitle="Selecione a data de fim"
                        setValue={setNovaReserva}
                        dateKey="datahora_fim"
                        currentValue={novaReserva.datahora_fim}
                      />

                      <TouchableOpacity
                        style={[
                          styles.closeButton,
                          { backgroundColor: "#B30E0A" },
                        ]}
                        onPress={criarReserva}
                      >
                        <Text style={{ color: "white" }}>Salvar reserva</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.voltarButton}
                  onPress={fecharModal}
                >
                  <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
          </ScrollView>
        </Modal>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logoutIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  botao: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: "90%",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
    alignSelf: "center",
  },
  salaButton: {
    width: 350,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  salaButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  modalContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  salaNumeroModal: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "#E0E0E0",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
    marginBottom: 10,
  },
  voltarButton: {
    backgroundColor: "#B30E0A",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
