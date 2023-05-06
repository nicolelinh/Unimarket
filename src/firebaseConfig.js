import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyCr10TXAJS1Cd92EUiojxPlHNsoIvSnTiw",
    authDomain: "unimarket-a7ff4.firebaseapp.com",
    projectId: "unimarket-a7ff4",
    storageBucket: "unimarket-a7ff4.appspot.com",
    messagingSenderId: "180731477688",
    appId: "1:180731477688:web:d056ea4ce59ca6342fbe4d",
    measurementId: "G-2F1BJQXR7T"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const auth = getAuth(app);
  export const storage = getStorage(app);
  export const functions = getFunctions(app);
