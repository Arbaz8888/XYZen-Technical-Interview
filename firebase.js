// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD-o5106cBiXgvkMyI2BxWLda-rr5RutOM",
    authDomain: "music-app-final-c9313.firebaseapp.com",
    projectId: "music-app-final-c9313",
    storageBucket: "music-app-final-c9313.firebasestorage.app",
    messagingSenderId: "326789284077",
    appId: "1:326789284077:web:5128830c5050ba50f64ce4"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
