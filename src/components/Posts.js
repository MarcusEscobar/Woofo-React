import React, { useEffect } from "react";
import { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'
import Comment from "./Comment.js"
import CommentDisplay from './CommentDisplay.js'

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore()

const Posts = ({ foto, RefAvatar, user, userName, caption, imageURL, refLike, tokenPost, irPerfil}) => {

const [avatar, setAvatar] = useState("")
const [quantlike, setQuantlike] = useState(0)
const [contador, setcontador] = useState(0)
const[listaComment, setListaComment] = useState([])
const [listaUsuariosLike, setListaUsuariosLike] = useState([])
refLike.then((doc)=>{
  setQuantlike(doc.data().like)
  setListaUsuariosLike(doc.data().user)
})

const darLike =()=>{
  db.collection("posts").doc(tokenPost).collection('likes').doc('like').get().then((doc)=>{
    const lista = doc.data().user
    const likes = doc.data().like
    if(lista.includes(user))
    {setcontador(contador-1)
      db.collection("posts").doc(tokenPost).collection('likes').doc('like').update({
        user: lista.filter((elemento)=> elemento !== user),
        like: likes-1
      })
    }
    else{
      setcontador(contador+1)
      lista.push(user)
      db.collection("posts").doc(tokenPost).collection('likes').doc('like').update({
        user: lista,
        like: likes+1
      })
    }
})}


RefAvatar.then((r)=>{setAvatar(r.data())})

useEffect(()=>{
  db.collection('posts').doc(tokenPost).collection('Comentários').orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
      setListaComment(
          snapshot.docs.map((doc)=>({
              id: doc.id,
              post: doc.data(),
          })))})});

  return (
    <div className='post'>
      <div className='Div_Esquerda_Image'>
        <img
              className='post__image'
              src={imageURL}
              alt={tokenPost}
          />
          <div className="legenda_e_Like" >

            {caption !== '' ?<>
            <p className='post__text'>
                <b className='Caption'>{userName}: &nbsp;</b>{caption}
            </p>
            <br/>
            </>:<></>}
            <button id='like__Button' className="like__Button" onClick={darLike}>{quantlike+contador}</button>
          </div>
      </div>
      <div className='Div_Direita_Comments' >
        <div className='Header_Comments'>
          <img className='avatar'
          onClick={()=>{irPerfil(userName)}}
          src={avatar.photo}
          alt={userName}/>
          <h3 onClick={()=>{irPerfil(userName)}} className='Username'>{userName} </h3>   
        </div>
        <div className='comment_component'>
                {listaComment.map(({id, post}) => (<CommentDisplay comentado={post.comment} user={post.user}/>))} 
        </div>
        <div className='Div_Comments-Input'>
          <Comment  tokenPost={tokenPost} user={user}/>
        </div>
      </div>
    </div>
  )
}

export default Posts;