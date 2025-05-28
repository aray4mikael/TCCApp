import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface LocationPoint {
  latitude: number;
  longitude: number;
}

export interface Activity {
  id: string;
  distance: number;
  duration: number;
  endTime: string;
  heartRateMax: number;
  heartRateMed: number;
  heartRateMin: number;
  locationPath: LocationPoint[];
  startTime: string;
  UserUID: string;
}

export const fetchUserActivities = async (uid: string): Promise<Activity[]> => {
  try {
    const activitiesRef = collection(db, "activities");
    const q = query(activitiesRef, where("UserUID", "==", uid));
    const querySnapshot = await getDocs(q);

    const activities: Activity[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp to ISO string if needed
      const activity = {
        id: doc.id,
        ...data,
        startTime:
          data.startTime?.toDate?.()?.toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }) || data.startTime,
        endTime:
          data.endTime?.toDate?.()?.toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }) || data.endTime,
      } as Activity;
      activities.push(activity);
    });

    // Sort activities by startTime (most recent first)
    return activities.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};
