import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEA2h3857keqif3-s33R1M3hSJGmgrh10",
  authDomain: "tindora-c728d.firebaseapp.com",
  projectId: "tindora-c728d",
  storageBucket: "tindora-c728d.appspot.com",
  messagingSenderId: "1082066929556",
  appId: "1:1082066929556:web:b7c190561ff90c7892b181",
  measurementId: "G-045VNNRPY1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/* Save users (email/password) with their name */
export const saveUser = async (user) => {
  const usersCollection = collection(db, "users");
  const userDoc = doc(usersCollection, user.uid);
  await setDoc(userDoc, {
    uid: user.uid,
    name: user.name,
    email: user.email,
  });
};
