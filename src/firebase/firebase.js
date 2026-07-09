import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXEqbIEH_wGIGvGRm7QipNJoUb__nunac",
  authDomain: "mealservice-eb286.firebaseapp.com",
  projectId: "mealservice-eb286",
  storageBucket: "mealservice-eb286.firebasestorage.app",
  messagingSenderId: "953119466091",
  appId: "1:953119466091:web:5ebfd1643fe62fa62b072e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export default app;