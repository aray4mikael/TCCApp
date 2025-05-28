import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  clearLoginCredentials,
  getLoginCredentials,
  saveLoginCredentials,
} from "../../firebase/sharedPreferences";
import { setGlobalUID } from "./globalVariables";
import { loginWithEmailAndPassword } from "./loginScript";

type RootStackParamList = {
  Login: undefined;
  BottomNavigation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    checkSavedCredentials();
  }, []);

  const checkSavedCredentials = async () => {
    const credentials = await getLoginCredentials();
    if (credentials) {
      setEmail(credentials.email || "");
      setPassword(credentials.password || "");
      setKeepLoggedIn(true);
      handleLogin(credentials.email || "", credentials.password || "");
    }
  };

  const handleLogin = async (emailToUse = email, passwordToUse = password) => {
    if (!emailToUse || !passwordToUse) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const user = await loginWithEmailAndPassword(emailToUse, passwordToUse);
      setGlobalUID(user.uid);

      if (keepLoggedIn) {
        await saveLoginCredentials(emailToUse, passwordToUse);
      } else {
        await clearLoginCredentials();
      }

      navigation.navigate("BottomNavigation");
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Email ou senha incorretos";
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <View style={styles.keepLoggedInContainer}>
        <Text>Manter conectado</Text>
        <Switch
          value={keepLoggedIn}
          onValueChange={setKeepLoggedIn}
          disabled={loading}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => handleLogin()}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  keepLoggedInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
