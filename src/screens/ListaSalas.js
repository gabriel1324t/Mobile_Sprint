import { useEffect, useState } from "react";
import api from "../axios/axios";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Image
} from "react-native";
import Layout from "../components/layout";

export default function ListaSalas() {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
  
      {/* Card cinza com título e lista */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Salas:</Text>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={salas}
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
      

      {/* Modal */}
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


              <Text style={styles.salaNumeroModal}>{salaSelecionada.numero}</Text>

              <View style={styles.modalContent}>
                <Text style={styles.sectionTitle}>Descrição :</Text>
                <Text style={styles.descriptionText}>
                  {salaSelecionada.descricao}
                </Text>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Capacidade :</Text>
                <Text style={styles.descriptionText}>
                  Máxima : {salaSelecionada.capacidade} alunos
                </Text>

                <TouchableOpacity style={styles.agendarButton}>
                  <TouchableOpacity onPress={() => navigation.navigate("Agendamento")}>
                  <Text style={styles.buttonText}>Agendar</Text>
                  </TouchableOpacity>
                  
                </TouchableOpacity>
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
  },  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
    alignSelf: "center"
  },
  salaButton: {
    width: "370",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  
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
  senaiLogo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  salaNumeroModal: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "#E0E0E0",
    width: "100%",
    height: "50%",
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
  agendarButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: "center",
  },
  voltarButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
