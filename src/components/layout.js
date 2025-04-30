import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Layout({ children }) {
  return (
    
      <View style={{ flex: 1 }}>
      <Image
                source={require("../../assets/senai.png")}
                style={styles.logo}
                resizeMode="contain"
              />
        {/* Cabeçalho */}
        <View style={styles.header}>
         
            <Icon name="person" size={30} color="black" />
        
        </View>
        {/* Conteúdo principal */}
        <View style={styles.container}>{children}</View>
      </View>
  );
}

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 60,
        marginBottom: 20,
        alignSelf: "center"
      },
  header: {
    justifyContent: "center",
    alignItems: "top",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
});
