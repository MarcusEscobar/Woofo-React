import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

import {firebaseConfig} from './config.js'
  
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const storage = firebase.storage()
const db = app.firestore()

export { auth, db, storage } 