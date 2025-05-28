import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface UserData {
  name: string;
  email: string;
  // Add other user fields as needed
}

export const fetchUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log("No user document found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
