import React, { useEffect } from "react";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'
import CommentDisplay from './CommentDisplay.js'


const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

const Comment = ({tokenPost, user}) => {

const[comment, setComment] = useState('')
const[listaComment, setListaComment] = useState([])

const comentar = ()=>{
    db.collection('posts').doc(tokenPost).collection('Comentários').doc(tokenPost+comment).set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        comment:comment,
        user:user,
    }).then(()=>{
        db.collection('posts').doc(tokenPost).collection('Comentários').doc(tokenPost+comment).get().then((doc)=>{      })
    })
    setComment('')
}

useEffect(()=>{
    db.collection('posts').doc(tokenPost).collection('Comentários').orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
        setListaComment(
            snapshot.docs.map((doc)=>({
                id: doc.id,
                post: doc.data(),
            })))})});
  return (
    <div className="Div__Comments">
        {listaComment.map(({id, post}) => (
            <CommentDisplay
            comentado={post.comment}
            user={post.user}
            />
        ))}
        <input className="Input__Comment" placeholder='Comente aqui' type="text" value={comment} onChange={(e)=> { setComment(e.target.value) }} ></input>
        <button className="Button_Comentar" onClick={comentar}>Comentar</button>
       
    </div>
  )
}

export default Comment