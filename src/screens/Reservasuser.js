
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Reservas() {
  const route = useRoute();
  const { reservas } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Reservas</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Sala: {sala.nome}</Text>
            <Text>Data: {sala.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
