import {
  StyleSheet,
  FlatList,
  Animated,
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import OnboardingItem from "../../components/OnboardingItem";
import onboardingText from "../../onboardingText";

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const itemWidth = width;

  const handleSkipToLast = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: onboardingText.length - 1 });
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: onboardingText.length - 1 });
      }, 10);
    }
  };

  const handleCameraButton = () => {
    navigation.navigate("camera");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          ref={flatListRef}
          data={onboardingText}
          renderItem={({ item, index }) => (
            <View style={{ width }}>
              <OnboardingItem item={item} />
              {/* Add Skip Button on the first page */}
              {index === 0 && (
                <View style={styles.skipButtonContainer}>
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkipToLast}
                  >
                    <Text style={styles.skipButtonText}>Skip to Last</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Add Analyze Button on the last page */}
              {index === onboardingText.length - 1 && (
                <View style={styles.analyzeButtonContainer}>
                  <TouchableOpacity
                    style={styles.analyzeButton}
                    onPress={handleCameraButton}
                  >
                    <Text style={styles.analyzeButtonText}>Analyze</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
        />
      </View>
      {/* Bullet Indicators */}
      <View style={styles.indicatorContainer}>
        {onboardingText.map((_, index) => {
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * itemWidth,
              index * itemWidth,
              (index + 1) * itemWidth,
            ],
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * itemWidth,
              index * itemWidth,
              (index + 1) * itemWidth,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.indicator,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#50c878",
    marginHorizontal: 4,
  },
  skipButtonContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  skipButton: {
    backgroundColor: "#50c878",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 900,
  },
  analyzeButtonContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  analyzeButton: {
    backgroundColor: "#50c878",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 900,
  },
});
