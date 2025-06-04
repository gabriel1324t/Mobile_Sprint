import React from "react";
import { View, StyleSheet, Image } from "react-native";

export default function Avatar({ source }) {
  return source ? (
    <Image source={source} style={styles.avatar} />
  ) : (
    <View style={styles.avatar} />
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 30,
  },
});
