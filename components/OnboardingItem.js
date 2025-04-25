import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import React from "react";

const OnboardingItem = ({ item }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.uri}
        style={[styles.image, { width, resizeMode: "contain" }]}
      />
      <View style={{ flex: 0.3 }}>
        <Text style={styles.judul}>{item.judul}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.5,
    justifyContent: "ces",
  },
  judul: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 18,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 64,
  },
});
