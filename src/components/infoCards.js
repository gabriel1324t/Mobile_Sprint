import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function UserInfoCard({ value, placeholder }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      editable={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    padding: 12,
    marginVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
});
