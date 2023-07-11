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

const Posts = ({user, userLogName, userName, userEmail, caption, imageURL, tokenPost, irPerfil }) => {

const [userData, setUserData] = useState("")
const [quantlike, setQuantlike] = useState(0)
const [contador, setcontador] = useState(0)
const [listaComment, setListaComment] = useState([])
const [listaUsuariosLike, setListaUsuariosLike] = useState([])
const [boleanFalse, setBolean] = useState(false)

useEffect(()=>{
  db.collection('Users').doc(userEmail).get().then((data)=>{setUserData(data.data())})
},[]);
useEffect(()=>{
  db.collection("posts").doc(tokenPost).collection('likes').doc('like').get().then((doc)=>{
    setQuantlike(doc.data().like)
    setListaUsuariosLike(doc.data().user)})
},[]);
useEffect(()=>{
  db.collection('posts').doc(tokenPost).collection('Comentários').orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
      setListaComment(
          snapshot.docs.map((doc)=>({
              id: doc.id,
              post: doc.data(),
          })))})},[]);

function darLike(){
  db.collection("posts").doc(tokenPost).collection('likes').doc('like').get().then((doc)=>{
    const lista = doc.data().user
    const likes = doc.data().like
    if(lista.includes(user))
    {setcontador(contador-1)
      setBolean(false)
      setListaUsuariosLike([])
      db.collection("posts").doc(tokenPost).collection('likes').doc('like').update({
        user: lista.filter((elemento)=> elemento !== user),
        like: likes-1
      }).then(()=>{})
    }
    else{
      setcontador(contador+1)
      setListaUsuariosLike(doc.data().user)
      setBolean(true)
      lista.push(user)
      db.collection("posts").doc(tokenPost).collection('likes').doc('like').update({
        user: lista,
        like: likes+1
      })
    }
})}

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
            </>:<>
            <div style={{background:'none',}} ></div>
            </>}
            <div className="Div_Like" >
              <p>{quantlike+contador}</p>
              {listaUsuariosLike.includes(user) || boleanFalse ?<>
                <img
                  style={{height:'30px' , background:'none', cursor:'pointer' }}
                  src={require('./static/LikePrecionado.png')}
                  alt="like"
                  onClick={darLike}
                />
              </>:<>  
                <img
                  style={{height:'30px' , background:'none'}}
                  src={require('./static/LikeSemPrecionar.png')}
                  alt="like"
                  onClick={darLike}
                />
              </>}
            </div>   
          </div>
      </div>
      <div className='Div_Direita_Comments' >
        <div className='Header_Comments'>
          <img className='avatar'
          onClick={()=>{irPerfil(userEmail)}}
          src={userData.photo}
          alt={userData.nome}/>
          <h3 onClick={()=>{irPerfil(userEmail)}} className='Username'>{userName} </h3>   
        </div>
        <div className='comment_component'>
                {listaComment.map(({id, post}) => (<CommentDisplay key={id} comentado={post.comment} userName={post.userName}/>))} 
        </div>
        <div className='Div_Comments-Input'>
          <Comment key={user.id}  tokenPost={tokenPost} user={user} userName={userLogName}/>
        </div>
      </div>
    </div>
  )
}

export default Posts;