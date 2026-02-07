import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD7F0VwvOt0O7fipwMCOCZ5RT7ev3Yr7bY",
  authDomain: "foodgo-ui.firebaseapp.com",
  projectId: "foodgo-ui",
  storageBucket: "foodgo-ui.firebasestorage.app",
  messagingSenderId: "539962237180",
  appId: "1:539962237180:web:dcac9e3ccf7ae0e4ea7779",
  measurementId: "G-DBY8GST7Y7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
