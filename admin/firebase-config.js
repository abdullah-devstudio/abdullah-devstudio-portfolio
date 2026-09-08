/* Shared Firebase initialization for the admin area. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRb4dqnLNF0eVx1igBxRDvxGuW6-RNRHI",
  authDomain: "abdullahdevstudio-portfolio.firebaseapp.com",
  projectId: "abdullahdevstudio-portfolio",
  storageBucket: "abdullahdevstudio-portfolio.firebasestorage.app",
  messagingSenderId: "298391298603",
  appId: "1:298391298603:web:b33642d048779187d4406e",
  measurementId: "G-XREGS83Z43"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };