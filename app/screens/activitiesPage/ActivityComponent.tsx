import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Activity } from "./activitiesScript";
import { ActivityMap } from "./ActivityMap";

interface ActivityComponentProps {
  activity: Activity;
  onPress?: () => void;
}

export const ActivityComponent: React.FC<ActivityComponentProps> = ({
  activity,
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    try {
      // If the date is already formatted by Firestore, return it
      if (dateString.includes("/")) {
        return dateString;
      }

      // Otherwise, format it
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Data não disponível";
      }

      return date.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data não disponível";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatDistance = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(2)} km`;
  };

  return (
    <TouchableOpacity style={styles.activityCard} onPress={onPress}>
      <View style={styles.activityHeader}>
        <MaterialCommunityIcons name="run" size={24} color="#A18AE6" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.activityDate}>
            {formatDate(activity.startTime)}
          </Text>
          <Text style={styles.activityDuration}>
            {formatDuration(activity.duration)}
          </Text>
        </View>
      </View>

      <View style={styles.activityDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={16}
            color="#6B6B6B"
          />
          <Text style={styles.detailText}>
            {formatDistance(activity.distance)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={16}
            color="#6B6B6B"
          />
          <Text style={styles.detailText}>{activity.heartRateMed} bpm</Text>
        </View>
      </View>

      {activity.locationPath && activity.locationPath.length > 0 && (
        <ActivityMap locationPath={activity.locationPath} />
      )}

      <View style={styles.heartRateContainer}>
        <View style={styles.heartRateItem}>
          <Text style={styles.heartRateLabel}>Máx</Text>
          <Text style={styles.heartRateValue}>{activity.heartRateMax}</Text>
        </View>
        <View style={styles.heartRateItem}>
          <Text style={styles.heartRateLabel}>Méd</Text>
          <Text style={styles.heartRateValue}>{activity.heartRateMed}</Text>
        </View>
        <View style={styles.heartRateItem}>
          <Text style={styles.heartRateLabel}>Mín</Text>
          <Text style={styles.heartRateValue}>{activity.heartRateMin}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  activityDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  activityDuration: {
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 2,
  },
  activityDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 5,
    color: "#6B6B6B",
    fontSize: 14,
  },
  heartRateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
  },
  heartRateItem: {
    alignItems: "center",
  },
  heartRateLabel: {
    fontSize: 12,
    color: "#6B6B6B",
    marginBottom: 2,
  },
  heartRateValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
});
