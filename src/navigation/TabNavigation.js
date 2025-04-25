import { StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavigation from "./StackNavigation";
import HistoryScreen from "../screen/HistoryScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#7ad598",
          height: 80,
          paddingBottom: 10,
        },
        tabBarActiveBackgroundColor: "#50c878",
        tabBarInactiveBackgroundColor: "#7ad598",
        tabBarIconStyle: {
          height: 60,
          width: 40,
        },
      }}
    >
      <Tab.Screen
        name="main"
        component={StackNavigation}
        options={{
          tabBarShowLabel: false,
          headerTitle: "under development by linggaryno",
          headerTitleStyle: {
            color: "#d9d9d9",
            fontWeight: 400,
            textAlign: "center",
          },
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="line-scan" size={40} color="#fff" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={HistoryScreen}
        options={{
          tabBarShowLabel: false,
          headerTitle: "under development by linggaryno",
          headerTitleStyle: {
            color: "#d9d9d9",
            fontWeight: 400,
            textAlign: "center",
          },
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <Octicons name="history" size={40} color="#fff" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
