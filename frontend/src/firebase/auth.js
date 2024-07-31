import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { saveUser } from './db';

const auth = getAuth();

export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

/* Calls saveUser function in auth.js */
export const registerUserWithDetails = async (email, password, name) => {
  try {
    const userCredential = await register(email, password);
    const user = userCredential.user;
    await saveUser({ uid: user.uid, name, email });
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};