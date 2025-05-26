import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  Timestamp, 
  FieldValue,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8aAFfY21l9bEDFG-kq9FcHq8RWKyX8zA",
  authDomain: "jusa-dce9e.firebaseapp.com",
  projectId: "jusa-dce9e",
  storageBucket: "jusa-dce9e.firebasestorage.app",
  messagingSenderId: "310789810675",
  appId: "1:310789810675:web:0f83c2dc31935fffc54a86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);

// Export types and functions that we'll use elsewhere
export { 
  Timestamp, 
  FieldValue,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc
};
