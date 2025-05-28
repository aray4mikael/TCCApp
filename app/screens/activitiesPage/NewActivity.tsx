import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CurrentLocationMap } from "./CurrentLocationMap";
import {
  LocationPoint,
  clearSavedLocations,
  startLocationTracking,
  stopLocationTracking,
} from "./activityTracking";

type RootStackParamList = {
  BottomNavigation: undefined;
  NewActivity: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NewActivity() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null
  );
  const [savedLocations, setSavedLocations] = useState<LocationPoint[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleLocationUpdate = (location: LocationPoint) => {
    setCurrentLocation(location);
    setSavedLocations((prev) => [...prev, location]);
    console.log("Nova localização salva:", location);
  };

  const handleToggleActivity = async () => {
    if (!isActive) {
      setIsStarting(true);
      const trackingStarted = await startLocationTracking(handleLocationUpdate);

      if (trackingStarted) {
        setIsStarting(false);
        setIsActive(true);
        clearSavedLocations(); // Limpar localizações anteriores
      } else {
        setIsStarting(false);
        Alert.alert(
          "Erro",
          "Não foi possível iniciar o rastreamento de localização. Verifique as permissões do aplicativo."
        );
      }
    } else {
      try {
        setIsStarting(true);
        const activity = await stopLocationTracking();
        console.log("Atividade salva:", activity);
        Alert.alert("Sucesso", "Atividade salva com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("BottomNavigation"),
          },
        ]);
      } catch (error) {
        console.error("Erro ao salvar atividade:", error);
        Alert.alert(
          "Erro",
          "Não foi possível salvar a atividade. Tente novamente."
        );
      } finally {
        setIsStarting(false);
        setIsActive(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nova Atividade</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Sua localização atual</Text>
        <CurrentLocationMap />

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(time)}</Text>
          {savedLocations.length > 0 && (
            <Text style={styles.locationCount}>
              {savedLocations.length} localizações salvas
            </Text>
          )}
        </View>

        <View style={styles.startButtonContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              isActive ? styles.stopButton : styles.startButton,
              isStarting && styles.startButtonDisabled,
            ]}
            onPress={handleToggleActivity}
            disabled={isStarting}
          >
            {isStarting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={isActive ? "stop" : "play"}
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.startButtonText}>
                  {isActive ? "Parar Atividade" : "Iniciar Atividade"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#6B6B6B",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  timerContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    fontFamily: "monospace",
  },
  locationCount: {
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 8,
  },
  startButtonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  startButton: {
    backgroundColor: "#A18AE6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stopButton: {
    backgroundColor: "#E66B6B",
  },
  startButtonDisabled: {
    backgroundColor: "#C4B5E6",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
