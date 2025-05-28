import * as Location from "expo-location";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getGlobalUID } from "../login/globalVariables";

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

let locationSubscription: Location.LocationSubscription | null = null;
let savedLocations: LocationPoint[] = [];
let startTime: number | null = null;
let lastLocationTime: number = 0;
let locationInterval: NodeJS.Timeout | null = null;
let isTrackingActive = false;

// Função para garantir que o startTime seja mantido
const getStartTime = () => {
  if (!startTime && savedLocations.length > 0) {
    console.log("Recuperando startTime da primeira localização");
    startTime = savedLocations[0].timestamp;
  }
  return startTime;
};

export const startLocationTracking = async (
  onLocationUpdate: (location: LocationPoint) => void
) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    // Limpar dados anteriores
    savedLocations = [];
    lastLocationTime = 0;
    locationInterval = null;
    isTrackingActive = true;

    // Iniciar o tempo
    startTime = Date.now();
    lastLocationTime = startTime;
    console.log(
      "Iniciando rastreamento em:",
      new Date(startTime).toISOString()
    );

    // Configurar o rastreamento de localização
    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000, // 30 segundos
        distanceInterval: 5, // 5 metros
      },
      (location) => {
        if (!isTrackingActive) return;

        const currentTime = Date.now();
        // Só salva se passou pelo menos 30 segundos desde a última localização
        if (currentTime - lastLocationTime >= 30000) {
          const newLocation: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: currentTime,
          };
          savedLocations.push(newLocation);
          onLocationUpdate(newLocation);
          lastLocationTime = currentTime;
          console.log("Nova localização registrada:", newLocation);
        }
      }
    );

    // Configurar intervalo para forçar coleta a cada 30 segundos
    locationInterval = setInterval(async () => {
      if (!isTrackingActive) return;

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const newLocation: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: Date.now(),
        };

        savedLocations.push(newLocation);
        onLocationUpdate(newLocation);
        lastLocationTime = Date.now();
        console.log("Localização forçada registrada:", newLocation);
      } catch (error) {
        console.error("Erro ao forçar coleta de localização:", error);
      }
    }, 30000);

    // Registrar localização inicial
    const initialLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const initialLocationPoint: LocationPoint = {
      latitude: initialLocation.coords.latitude,
      longitude: initialLocation.coords.longitude,
      timestamp: Date.now(),
    };

    savedLocations.push(initialLocationPoint);
    onLocationUpdate(initialLocationPoint);
    console.log("Localização inicial registrada:", initialLocationPoint);

    return true;
  } catch (error) {
    console.error("Error starting location tracking:", error);
    isTrackingActive = false;
    return false;
  }
};

export const stopLocationTracking = async () => {
  isTrackingActive = false;

  // Limpar intervalos e subscriptions
  if (locationInterval) {
    clearInterval(locationInterval);
    locationInterval = null;
  }

  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }

  // Registrar localização final
  try {
    const finalLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const finalLocationPoint: LocationPoint = {
      latitude: finalLocation.coords.latitude,
      longitude: finalLocation.coords.longitude,
      timestamp: Date.now(),
    };

    savedLocations.push(finalLocationPoint);
    console.log("Localização final registrada:", finalLocationPoint);
  } catch (error) {
    console.error("Error getting final location:", error);
  }

  const endTime = Date.now();
  const activityStartTime = getStartTime();

  if (!activityStartTime) {
    console.error(
      "Não foi possível determinar o horário de início da atividade"
    );
    throw new Error("Activity start time not found");
  }

  // Calcular duração em minutos
  const durationInSeconds = Math.floor((endTime - activityStartTime) / 1000);
  const durationInMinutes = Math.floor(durationInSeconds / 60);
  console.log("Duração da atividade:", durationInMinutes, "minutos");

  // Calcular distância total
  let totalDistance = 0;
  console.log(
    "Calculando distância total com",
    savedLocations.length,
    "pontos"
  );

  for (let i = 1; i < savedLocations.length; i++) {
    const prev = savedLocations[i - 1];
    const curr = savedLocations[i];
    const segmentDistance = calculateDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );
    totalDistance += segmentDistance;
    console.log(
      `Segmento ${i}: ${segmentDistance.toFixed(2)}m (${prev.latitude},${
        prev.longitude
      } -> ${curr.latitude},${curr.longitude})`
    );
  }

  console.log("Distância total calculada:", totalDistance.toFixed(2), "metros");

  // Simular dados de frequência cardíaca (substitua por dados reais do sensor)
  const heartRateMax = Math.floor(Math.random() * 40) + 140; // entre 140 e 180
  const heartRateMin = Math.floor(Math.random() * 20) + 60; // entre 60 e 80
  const heartRateMed = Math.floor((heartRateMax + heartRateMin) / 2);

  try {
    const userId = getGlobalUID();
    if (!userId) throw new Error("User not logged in");

    const activityData = {
      UserUID: userId,
      distance: Math.round(totalDistance), // distância em metros
      duration: durationInMinutes, // duração em minutos
      endTime: new Date(endTime),
      heartRateMax: heartRateMax,
      heartRateMed: heartRateMed,
      heartRateMin: heartRateMin,
      locationPath: savedLocations.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      })),
      startTime: new Date(activityStartTime),
    };

    console.log("Salvando atividade com dados:", activityData);
    const docRef = await addDoc(collection(db, "activities"), activityData);
    console.log("Activity saved with ID:", docRef.id);

    return {
      ...activityData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error saving activity:", error);
    throw error;
  } finally {
    clearSavedLocations();
  }
};

export const clearSavedLocations = () => {
  savedLocations = [];
  startTime = null;
  lastLocationTime = 0;
  isTrackingActive = false;
};

// Função auxiliar para calcular distância entre dois pontos em metros
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Raio da Terra em metros
  const R = 6371e3;

  // Converter graus para radianos
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  // Fórmula de Haversine
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distância em metros
  const distance = R * c;

  // Se a distância for muito pequena (menos de 1 metro), considerar como 0
  // para evitar erros de precisão do GPS
  return distance < 1 ? 0 : distance;
}
