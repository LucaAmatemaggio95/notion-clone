// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notion-clone-bab44.firebaseapp.com",
  projectId: "notion-clone-bab44",
  storageBucket: "notion-clone-bab44.appspot.com",
  messagingSenderId: "838492190026",
  appId: "1:838492190026:web:42999a6cc67c1f3887fdb3",
  measurementId: "G-RW8GZ458CY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

/**
 * Extract the image from the DALLE url and upload it to the Firebase Storage
 * @param imageUrl
 * @param name
 * @returns URL of the image inside Firebase
 */
export async function uploadFileToFirebase(imageUrl: string, name: string) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const fileName = name.replace(" ", "") + Date.now() + ".jpeg";

    // we create the storage reference to this file
    const storageRef = ref(storage, fileName);

    // upload the buffer containing the image to the storage
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg",
    });
    const firebaseUrl = await getDownloadURL(storageRef);
    return firebaseUrl;
  } catch (error) {
    console.error(error);
  }
}
