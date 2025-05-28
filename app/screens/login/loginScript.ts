import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

export async function loginWithEmailAndPassword(
  email: string,
  password: string
) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}
