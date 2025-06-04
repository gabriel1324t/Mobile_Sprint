import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReservaItem({ sala, inicio, fim }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sala: {sala}</Text>
      <Text>Início: {inicio}</Text>
      <Text>Fim: {fim}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
