import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function Layout({ children }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../assets/senai.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
          <Icon name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
    alignSelf: "center",
  },
  header: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
});
