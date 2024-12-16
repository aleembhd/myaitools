import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDhIH8qPXigYqudNu_JxNIj86b-CkdZTnU",
    authDomain: "myaitools-f0dc8.firebaseapp.com",
    projectId: "myaitools-f0dc8",
    storageBucket: "myaitools-f0dc8.firebasestorage.app",
    messagingSenderId: "599738289567",
    appId: "1:599738289567:web:78492007b06f3faebb81aa",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 