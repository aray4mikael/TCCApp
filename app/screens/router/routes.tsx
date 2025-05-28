import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import NewActivity from "../activitiesPage/NewActivity";
import BottomNavigation from "../bottomNavigation/BottomNavigation";
import LoginScreen from "../login/LoginScreen";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BottomNavigation"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewActivity"
        component={NewActivity}
        options={{
          title: "Nova Atividade",
          headerStyle: {
            backgroundColor: "#F9FAFF",
          },
          headerTintColor: "#222",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}
