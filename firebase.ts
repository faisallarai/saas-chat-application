// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAD7i46N3Xpa_5YEo8IJWc0BzyS2V4SFxU',
  authDomain: 'sass-chat-application.firebaseapp.com',
  projectId: 'sass-chat-application',
  storageBucket: 'sass-chat-application.appspot.com',
  messagingSenderId: '647808139070',
  appId: '1:647808139070:web:6f8ce6225120e254c5f66f',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, auth, functions };
