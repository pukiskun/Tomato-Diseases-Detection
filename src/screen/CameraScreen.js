import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState(false);

  const PROJECT_ID = "YOUR_PROJECT_ID";
  const ENDPOINT_ID = "YOUR_END_POINT";

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermission(cameraStatus === "granted" && libraryStatus === "granted");
    };

    requestPermissions();
    fetchAccessToken();
  }, []);

  const fetchAccessToken = async () => {
    try {
      const client_id = "YOUR_CLIENT_ID";
      const client_secret = "YOUR_SECRET_ID";
      const refresh_token = "YOUR_REFRESH_TOKEN";
      const token_url = "https://oauth2.googleapis.com/token";

      const response = await axios.post(token_url, {
        client_id,
        client_secret,
        refresh_token,
        grant_type: "refresh_token",
        scope: "https://www.googleapis.com/auth/cloud-platform",
      });

      const { access_token } = response.data;
      setAccessToken(access_token);
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response?.data || error
      );
      alert("Failed to fetch access token. Check your OAuth credentials.");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const analyzeImage = async () => {
    if (!imageUri) {
      alert("Please select an image first.");
      return;
    }

    if (!accessToken) {
      alert("Access token is not available. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      const resizedUri = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      const base64ImageData = await FileSystem.readAsStringAsync(
        resizedUri.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`;

      const requestData = {
        instances: [{ content: base64ImageData }],
        parameters: {
          confidenceThreshold: 0.5,
          maxPredictions: 5,
        },
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response: ", response.data);

      const predictions =
        response.data.predictions && response.data.predictions[0];

      if (
        !predictions ||
        !predictions.displayNames ||
        predictions.displayNames.length === 0
      ) {
        alert("Bukan Daun Tomat! Silahkan Gunakan Objek Lain");
        return;
      }

      const displayNames = predictions.displayNames || [];
      const confidences = predictions.confidences || [];

      const labelsData = displayNames.map((name, index) => ({
        name,
        confidence: confidences[index],
      }));

      setLabels(labelsData);

      await saveToHistory(labelsData);

      navigation.navigate("result", { imageUri, labels: labelsData });
    } catch (error) {
      console.log(
        "Error analyzing image: ",
        error.response ? error.response.data : error
      );
      alert("Image analyzing error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = async (labelsData) => {
    const newHistoryItem = {
      id: new Date().getTime().toString(),
      time: new Date().toLocaleDateString(),
      condition: labelsData[0]?.name || "Unknown",
      severity: labelsData[0]?.confidence
        ? (parseFloat(labelsData[0].confidence) * 100).toFixed(2) + "%"
        : "0.00%",
    };

    try {
      const existingHistory = await AsyncStorage.getItem("history");
      const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
      historyArray.push(newHistoryItem);
      await AsyncStorage.setItem("history", JSON.stringify(historyArray));
      console.log("History saved.");
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>
          Izinkan Apliaksi untuk Mengakses Kamera dan Galeri
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.judul}>Ambil Gambar</Text>
        <Text style={styles.deskripsi}>
          Pastikan daun terlihat jelas {"\n"} dan tidak buram.
        </Text>

        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 300, height: 300 }}
          />
        )}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={takePhoto}
            style={styles.button}
            disabled={isLoading}
          >
            <Image
              source={require("../../assets/images-button/logo-kamera.png")}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.button}
            disabled={isLoading}
          >
            <Image
              source={require("../../assets/images-button/logo-galeri.png")}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Galeri</Text>
          </TouchableOpacity>
        </View>
        {imageUri && (
          <TouchableOpacity
            onPress={analyzeImage}
            style={styles.analyzeButton}
            disabled={isLoading}
          >
            <Text style={styles.analyzeButtonText}>Analyze</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    marginTop: 50,
  },
  buttonImage: {
    width: 60,
    height: 60,
  },
  buttonText: {
    fontWeight: "700",
  },
  analyzeButton: {
    backgroundColor: "#50c878",
    padding: 15,
    width: 100,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 50,
  },
  analyzeButtonText: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
    fontWeight: 700,
  },
  judul: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#50c878",
  },
  deskripsi: {
    fontSize: 15,
    fontWeight: "500",
    color: "#828282",
    textAlign: "center",
    marginBottom: 50,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
