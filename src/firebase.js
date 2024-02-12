// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC3VLh-sFVNuFm0J3z1IDCdmk3tB4zwIKs',
  authDomain: 'dashboard-e4e37.firebaseapp.com',
  projectId: 'dashboard-e4e37',
  storageBucket: 'dashboard-e4e37.appspot.com',
  messagingSenderId: '627884346902',
  appId: '1:627884346902:web:f44b2c65646c3973b76f37',
  measurementId: 'G-GGDSPF8ZXB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
