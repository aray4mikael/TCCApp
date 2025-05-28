import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  KEEP_LOGGED_IN: "@keep_logged_in",
  USER_EMAIL: "@user_email",
  USER_PASSWORD: "@user_password",
};

export const saveLoginCredentials = async (email: string, password: string) => {
  try {
    await AsyncStorage.setItem(KEYS.KEEP_LOGGED_IN, "true");
    await AsyncStorage.setItem(KEYS.USER_EMAIL, email);
    await AsyncStorage.setItem(KEYS.USER_PASSWORD, password);
  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
  }
};

export const clearLoginCredentials = async () => {
  try {
    await AsyncStorage.setItem(KEYS.KEEP_LOGGED_IN, "false");
    await AsyncStorage.removeItem(KEYS.USER_EMAIL);
    await AsyncStorage.removeItem(KEYS.USER_PASSWORD);
  } catch (error) {
    console.error("Erro ao limpar credenciais:", error);
  }
};

export const getLoginCredentials = async () => {
  try {
    const keepLoggedIn = await AsyncStorage.getItem(KEYS.KEEP_LOGGED_IN);
    if (keepLoggedIn === "true") {
      const email = await AsyncStorage.getItem(KEYS.USER_EMAIL);
      const password = await AsyncStorage.getItem(KEYS.USER_PASSWORD);
      return { email, password };
    }
    return null;
  } catch (error) {
    console.error("Erro ao recuperar credenciais:", error);
    return null;
  }
};
