import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAE4gMJWd9BkXACQ5USONZQfdcGc4QVv9A",
  authDomain: "jusa-4cf5c.firebaseapp.com",
  projectId: "jusa-4cf5c",
  storageBucket: "jusa-4cf5c.firebasestorage.app",
  messagingSenderId: "394617037680",
  appId: "1:394617037680:web:013d04be9260f1973b25b5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  auth,
  db,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
};

export default app;