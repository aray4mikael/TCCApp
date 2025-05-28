import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getGlobalUID } from "../login/globalVariables";
import { fetchUserData, UserData } from "./homeScript";

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Activities: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomePage() {
  const navigation = useNavigation<NavigationProp>();
  const userId = getGlobalUID();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (userId) {
        try {
          const data = await fetchUserData(userId);
          setUserData(data);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };

    loadUserData();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {userData?.name || "Usuário"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <MaterialCommunityIcons name="cog" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Status Box */}
      <View style={styles.statusBox}>
        <MaterialCommunityIcons name="wifi" size={24} color="#4CAF50" />
        <Text style={styles.statusText}>HealthyBand conectada via Wi-fi</Text>
        <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
      </View>

      {/* Main Health Card */}
      <View style={styles.healthCard}>
        <Text style={styles.cardTitle}>Batimentos cardíacos</Text>
        <Text style={styles.bpmValue}>78 bpm</Text>

        <View style={styles.indicatorsRow}>
          <View style={styles.indicator}>
            <MaterialCommunityIcons
              name="thermometer"
              size={20}
              color="#6B6B6B"
            />
            <Text style={styles.indicatorText}>36.5°</Text>
          </View>

          <View style={styles.indicator}>
            <MaterialCommunityIcons name="water" size={20} color="#6B6B6B" />
            <Text style={styles.indicatorText}>120</Text>
          </View>

          <View style={styles.indicator}>
            <FontAwesome5 name="percentage" size={20} color="#6B6B6B" />
            <Text style={styles.indicatorText}>98%</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Atualizar leitura</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Activities")}
        >
          <Text style={styles.buttonText}>Iniciar Atividade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E8FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    flex: 1,
    marginLeft: 10,
    color: "#222",
    fontSize: 16,
  },
  healthCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#6B6B6B",
    marginBottom: 10,
  },
  bpmValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },
  indicatorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicatorText: {
    marginLeft: 5,
    color: "#6B6B6B",
    fontSize: 16,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: "#A18AE6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
