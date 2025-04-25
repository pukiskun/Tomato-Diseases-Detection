import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import artikelPenyakit from "../../artikelPenyakit";

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  const getPenyakitInfo = (className) => {
    const penyakit = artikelPenyakit.find(
      (penyakit) => penyakit.class === className
    );
    return penyakit;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        try {
          const storedHistory = await AsyncStorage.getItem("history");
          if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
          }
        } catch (error) {
          console.error("Error fetching history:", error);
        }
      };

      fetchHistory();
    }, [])
  );

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("history");
      setHistory([]);
      console.log("History cleared.");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const renderItem = ({ item }) => {
    const penyakitInfo = getPenyakitInfo(item.condition);
    const conditionName = penyakitInfo ? penyakitInfo.nama : "Unknown";

    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.time}</Text>
        <Text style={styles.itemText}>{conditionName}</Text>
        <Text style={styles.itemText}>{item.severity}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Waktu</Text>
      <Text style={styles.headerText}>Kondisi</Text>
      <Text style={styles.headerText}>Akurasi</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearButtonText}>Bersihkan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#50c878",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignSelf: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: 900,
  },
});
