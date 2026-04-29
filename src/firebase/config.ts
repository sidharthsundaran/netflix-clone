// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqFP00e23oNWVPAow29nG2Gvv0lXpl7_0",
  authDomain: "olx-clone-b0487.firebaseapp.com",
  projectId: "olx-clone-b0487",
  storageBucket: "olx-clone-b0487.appspot.com",
  messagingSenderId: "663806583434",
  appId: "1:663806583434:web:921e6f38f4be6bf9908373"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app }; 
