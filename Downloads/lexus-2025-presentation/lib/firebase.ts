import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjeoP0ia224jtc8U7JCoIYOHJcudBardo",
  authDomain: "myapp-58e0a.firebaseapp.com",
  projectId: "myapp-58e0a",
  storageBucket: "myapp-58e0a.firebasestorage.app",
  messagingSenderId: "835173729732",
  appId: "1:835173729732:web:6c6ecf404ed25fe1641091"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);