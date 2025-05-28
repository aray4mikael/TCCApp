import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import ActivitiesPage from "../activitiesPage/ActivitiesPage";
import ContactsPage from "../contactsPage/ContactsPage";
import HomePage from "../homePage/HomePage";
import ProfilePage from "../profilePage/ProfilePage";

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Activities") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Contacts") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "home";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Activities" component={ActivitiesPage} />
      <Tab.Screen name="Contacts" component={ContactsPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
