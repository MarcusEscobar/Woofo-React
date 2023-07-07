import React, { useEffect } from "react";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

const Comment = ({tokenPost, user, userName}) => {

const[comment, setComment] = useState('')


const comentar = ()=>{
    db.collection('posts').doc(tokenPost).collection('Comentários').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        comment:comment,
        user:user,
        userName:userName,
    })
    setComment('')
}

  return (
    <div style={{background: '#4E527B'}}>
        <div className="Div_Input_Comment">
            <input className="Input__Comment" placeholder='Comente aqui' type="text" value={comment} onChange={(e)=> { setComment(e.target.value) }} ></input>
            <button className="Button_Comentar" onClick={comentar}>Comentar</button>    
        </div>
    </div>
  )
}

export default Comment