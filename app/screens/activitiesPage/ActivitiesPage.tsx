import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getGlobalUID } from "../login/globalVariables";
import { Activity, fetchUserActivities } from "./activitiesScript";
import { ActivityComponent } from "./ActivityComponent";

type RootStackParamList = {
  Activities: undefined;
  NewActivity: undefined;
  BottomNavigation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getGlobalUID();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadActivities = async () => {
      if (userId) {
        try {
          const data = await fetchUserActivities(userId);
          setActivities(data);
        } catch (error) {
          console.error("Error loading activities:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadActivities();
  }, [userId]);

  const handleActivityPress = (activity: Activity) => {
    // Handle activity press - you can add navigation to activity details here
    console.log("Activity pressed:", activity.id);
  };

  const handleStartNewActivity = () => {
    navigation.navigate("NewActivity");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A18AE6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Atividades</Text>
        <TouchableOpacity
          style={styles.newActivityButton}
          onPress={handleStartNewActivity}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.newActivityButtonText}>Nova Atividade</Text>
        </TouchableOpacity>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="run" size={48} color="#6B6B6B" />
          <Text style={styles.emptyText}>Nenhuma atividade registrada</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          renderItem={({ item }) => (
            <ActivityComponent
              activity={item}
              onPress={() => handleActivityPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  newActivityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A18AE6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newActivityButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B6B6B",
  },
});
