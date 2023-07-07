import React, { useEffect } from "react";
import { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'
import CommentDisplay from './CommentDisplay.js'

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore()

const Perfil = ({username, userEmail, caption, imageURL, tokenPost}) => {

const [listaComment, setListaComment] = useState([])

useEffect(()=>{
  db.collection('posts').doc(tokenPost).collection('Comentários').orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
      setListaComment(
          snapshot.docs.map((doc)=>({
              id: doc.id,
              post: doc.data(),
          })))})},[]);

return (

    <div style={{background:'none'}} className='DivInterna_PostagemPerfi'>
      <dialog id={tokenPost} style={{height:'700px', width:'1000px'}} >
        <div style={{display:'flex'}}>
          <img
            src={imageURL}
            alt='postagens'
            style={{width:'650px', height:'650px', margin:'10px'}}
          />
          <div style={{}} >{caption}</div>
          <div className='comment_component'>
                {listaComment.map(({id, post}) => (<CommentDisplay key={id} comentado={post.comment} user={post.user} userName={post.userName}/>))} 
        </div>
        </div>
      </dialog>
      <div  className='Div__Postagens__Perfil'>
          <img
            src={imageURL}
            alt='postagens'
            onClick={()=>{document.getElementById(tokenPost).showModal()}}
          />
      </div>
    </div>
  )
}

export default Perfil;