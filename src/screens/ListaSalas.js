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
} from "react-native";
import Layout from "../components/layout";
import api from "../axios/axios";

export default function ListaSalas({ route }) {
  const { user } = route.params;
  const [salas, setSalas] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [busca, setBusca] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [novaReserva, setNovaReserva] = useState({
    datahora_inicio: "",
    datahora_fim: "",
    fk_id_usuario: "",
    fk_id_sala: "",
  });

  const buscarSala = () => {
    const filtradas = salas.filter((sala) =>
      sala.numero.toLowerCase().includes(busca.toLowerCase())
    );
    setResultado(filtradas);
  };

  async function criarReserva() {
    try {
      const response = await api.createReserva({
        datahora_inicio: novaReserva.datahora_inicio,
        datahora_fim: novaReserva.datahora_fim,
        fk_id_usuario: user.id_usuario,
        fk_id_sala: salaSelecionada.id_sala,
      });

      Alert.alert("Sucesso", response.data.message);

      setNovaReserva({
        datahora_inicio: "",
        datahora_fim: "",
        fk_id_usuario: "",
        fk_id_sala: "",
      });
      setMostrarForm(false);
    } catch (error) {
      console.log(
        "Erro ao criar reserva",
        error?.response?.data?.error || error
      );
      Alert.alert("Erro", error?.response?.data?.error || "Erro desconhecido.");
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
      console.error("Erro ao buscar salas:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalComDescricao(sala) {
    setSalaSelecionada(sala);
    setModalVisible(true);
  }

  function fecharModal() {
    setModalVisible(false);
    setSalaSelecionada(null);
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
          <View style={styles.modalContainer}>
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

                  <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: "#B30E0A" }]}
                    onPress={() => setMostrarForm(!mostrarForm)}
                  >
                    <Text style={{ color: "white" }}>
                      {mostrarForm ? "Cancelar" : "Criar nova reserva"}
                    </Text>
                  </TouchableOpacity>

                  {mostrarForm && (
                    <View style={{ marginTop: 20 }}>
                      <Text>Data e hora de início (AAAA-MM-DD HH:MM):</Text>
                      <TextInput
                        value={novaReserva.datahora_inicio}
                        onChangeText={(text) =>
                          setNovaReserva({
                            ...novaReserva,
                            datahora_inicio: text,
                          })
                        }
                        style={styles.input}
                        placeholder="Ex: 2025-04-30 14:00"
                      />

                      <Text>Data e hora de fim (AAAA-MM-DD HH:MM):</Text>
                      <TextInput
                        value={novaReserva.datahora_fim}
                        onChangeText={(text) =>
                          setNovaReserva({ ...novaReserva, datahora_fim: text })
                        }
                        style={styles.input}
                        placeholder="Ex: 2025-04-30 16:00"
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
          </View>
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
  }, //buscar
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
    //fundo
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
    flex: 1,
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
    fontSize: 20,
    lineHeight: 22,
    color: "#555",
  },
  voltarButton: {
    backgroundColor: "#B30E0A",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    position: "absolute",
    bottom: 30,
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
