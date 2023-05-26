import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDzRbVbrB7ZjJw-HylA5HM9DZ8Taf0eiiI",
    authDomain: "woof0-75c1f.firebaseapp.com",
    projectId: "woof0-75c1f",
    storageBucket: "woof0-75c1f.appspot.com",
    messagingSenderId: "10079225691",
    appId: "1:10079225691:web:a8c0e222346ef945a4bc7e",
    measurementId: "G-4R28M6JFQ4"
  };
  
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const storage = firebase.storage()
const db = app.firestore()

export { auth, db, storage } 