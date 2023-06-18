import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'
import Comment from "./Comment.js"

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore()

const Posts = ({ foto, RefAvatar, user, userName, caption, imageURL, refLike, tokenPost,}) => {

const [avatar, setAvatar] = useState("")
const [quantlike, setQuantlike] = useState(0)
const [contador, setcontador] = useState(0)
refLike.then((doc)=>{
  setQuantlike(doc.data().like)
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


  return (
    <div className='post'>
        <div className='post__header'>
            <img className='avatar'
            src={avatar.photo}
            alt={userName}/>
            <h3 className='Username'>{userName} </h3>
        </div>
        <img
            className='post__image'
            src={imageURL}
            alt={tokenPost}
        />
        <div className='post__rodape'>

        <button className='like__Button' onClick={darLike}>{quantlike+contador}</button>
        {caption !== '' ?<>
        <p className='post__text'>
            <b className='Caption'>{userName}: &nbsp;</b>{caption}
        </p>
        <br/>
        </>:<></>}
        <div className='post_comments'>
            <Comment
              tokenPost={tokenPost}
              user={user}
            />
        </div>

        </div>
    </div>
  )
}

export default Posts;