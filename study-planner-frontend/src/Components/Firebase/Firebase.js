// filepath: /home/acer/Desktop/Student-Planner/student-planner/study-planner-frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration object (replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyCjM137Nq0P18jDv2b2KZMpqxqlMJkl_A0",
  authDomain: "studentplanner-6fea8.firebaseapp.com",
  projectId: "studentplanner-6fea8",
  storageBucket: "studentplanner-6fea8.firebasestorage.app",
  messagingSenderId: "228518896228",
  appId: "1:228518896228:web:7cf49380c37313b746b571",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(firebaseApp);
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

// Function to request FCM token
export const requestForToken = async () => {
  try {
    if (!vapidKey) {
      console.warn("Missing REACT_APP_FIREBASE_VAPID_KEY; skipping FCM token request.");
      return null;
    }
    const currentToken = await getToken(messaging, {
      vapidKey,
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    return null;
  }
};

// Function to listen for incoming messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default firebaseApp;