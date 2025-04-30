import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import api from '../axios/axios';
import { Ionicons } from "@expo/vector-icons";

export default function Login({ navigation }){
  const [usuario, setUsuario] = useState ({ 
      email: "",
      senha: "",
      showPassword: false,
  });

  async function handleLogin() {
    
      await api.postLogin(usuario).then(
          (response)=>{
            console.log(response.data);
              Alert.alert("OK", response.data.message);
          navigation.navigate("ListaSalas");
          },(error)=>{
            console.log(error.response.data);
              Alert.alert('Erro',error.response.data.error);

              
          }
      )
  }
      
  return(
      <View style={styles.container}>
      <View style={styles.quadrado}>
      <Image
                    source={require('../../assets/senai.png')} // Caminho para a sua imagem
                    style={styles.image}
                />
      <TextInput 
      style={styles.input}
      placeholder="Email"
      value={usuario.email}
      onChangeText={(value)=> {
          setUsuario({...usuario, email: value});
      }}
      />
      <View style={styles.passwordContainer}>
      <TextInput
      style={styles.passwordInput}
      placeholder="Senha"
      value={usuario.senha}
      secureTextEntry={usuario.showPassword}
      onChangeText={(value)=> {
          setUsuario({...usuario, senha: value});
      }}
      />
      <TouchableOpacity style={styles.eyeIcon} onPress={() => setUsuario({ ...usuario, showPassword: !usuario.showPassword })}>
    <Ionicons name={usuario.showPassword ? "eye" : "eye-off"} size={24} color="grey" />
  </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("ListaSalas")}>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
         </TouchableOpacity>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.link}>Não esta cadastrado?   Clique aqui</Text>
            </TouchableOpacity>
            </View>
            </View>
      
  );
}


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F26F6F",
        },
        quadrado: { 
            backgroundColor: "#B22222", 
            padding: 100, 
            borderRadius: 15, 
            width: "90%", 
            maxWidth: 350, 
            alignItems: "center",
        },
        title: {
            color: "#FFF",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 15,
        },
        image: {
            width: 268, // Largura da imagem
            height: 70, // Altura da imagem
            padding:22,
            marginBottom: 40, // Espaçamento abaixo da imagem
        },
        input: {
            width: "200%",
            padding: 12,
            marginVertical: 12,
            borderRadius: 15,
            fontSize: 16,
            backgroundColor: "#FFF",
        },
        button: {
            width: "150%",
            padding: 15,
            backgroundColor: "#FF0802",
            borderRadius: 15,
            alignItems: "center",
            marginTop: 15,
        },
        buttonText: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
        },
        link: {
            color: "white",
            marginTop: 12,
            fontWeight: "600",
        },
        passwordContainer: {
            flexDirection: "row",
            alignItems: "center",
            width: "200%",  // Definir para ocupar todo o espaço disponível
            backgroundColor: "#FFF", // Para manter a mesma aparência do campo de senha
            borderRadius: 15,
            paddingHorizontal: 10,
            marginVertical: 12,
          },
          passwordInput: {
            flex: 1,  // Ocupa todo o espaço disponível
            height: 45,
            fontSize: 16,
            paddingHorizontal: 10,
            backgroundColor: "#FFF",
            borderRadius: 15,
          },
    });