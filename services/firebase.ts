
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyAh3H7rUw0wd994eWdkFS963M6PvhVXkdk",
  authDomain: "findtrader-india.firebaseapp.com",
  projectId: "findtrader-india",
  storageBucket: "findtrader-india.appspot.com",
  messagingSenderId: "767703226514",
  appId: "1:767703226514:web:1a33a23124ef58a071ae4b",
  measurementId: "G-0JKNSPDHG0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
