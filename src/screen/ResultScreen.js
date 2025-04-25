import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import artikelPenyakit from "../../artikelPenyakit";
import { SafeAreaView } from "react-native-safe-area-context";

const ResultScreen = ({ route }) => {
  const { imageUri, labels } = route.params;

  const [showSolusi, setShowSolusi] = useState(false);

  const getPenyakitInfo = (className) => {
    const penyakit = artikelPenyakit.find(
      (penyakit) => penyakit.class === className
    );
    return penyakit || { deskripsi: "Deskripsi tidak tersedia.", saran: [] };
  };

  const toggleSolusi = () => {
    setShowSolusi(!showSolusi);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <SafeAreaView
        contentContainerStyle={styles.container}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <Text style={styles.header}>Hasil Analisis</Text>
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.labelContainer}>
          {labels.map((label, index) => {
            const penyakitInfo = getPenyakitInfo(label.name);

            return (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.labelTitle}>
                  Kondisi: {label.name || "Unknown"}
                  {"\n"}
                  Akurasi: {(label.confidence * 100).toFixed(2)}%
                </Text>
                {showSolusi ? (
                  <View>
                    {penyakitInfo.saran.map((saran, idx) => (
                      <Text key={idx} style={styles.saranText}>
                        - {saran}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.description}>
                    {penyakitInfo.deskripsi}
                  </Text>
                )}
              </View>
            );
          })}

          <TouchableOpacity onPress={toggleSolusi} style={styles.button}>
            <Text style={styles.buttonText}>
              {showSolusi ? "Deskripsi" : "Solusi"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    alignSelf: "center",
  },
  labelContainer: {
    width: "100%",
    alignItems: "center",
  },
  resultItem: {
    marginBottom: 30,
    paddingHorizontal: 15,
    textAlign: "center",
  },
  labelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 10,
  },
  saranText: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#50c878",
    padding: 10,
    width: 100,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
    fontWeight: 700,
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    backgroundColor: "#fff",
  },
});
