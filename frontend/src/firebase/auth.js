import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { db } from "./db";

export const auth = getAuth();

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

    // Save user profile with additional fields
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      mealsFavorited: 0,
      mealsAccepted: 0,
      mealsRejected: 0,
      ingredientsSaved: 0,
    });
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};
