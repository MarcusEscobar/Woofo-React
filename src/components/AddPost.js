import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

import {firebaseConfig} from './config.js'
  
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
const db = app.firestore()

const AddPost = ({username}) => {
    
    const [caption,setcaption] = useState('')
    const [progress,setprogress] = useState(0)
    const [image,setImage] = useState(null)

    const handleUpload = ()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",(snapshot)=>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setprogress(progress);
            },
            (error)=>{
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        const TokenPost=url.substring(url.length-36,url.length)   
                        const DocRef = db.collection("posts").doc(TokenPost)           
                        DocRef.set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            userName: username,
                            tokenPost:TokenPost })
                            .then(()=>{
                               DocRef.collection('likes').doc('like').set({
                                like:0,
                                user: []
                               }).then(()=>{window.location.reload()})
                            })
                        setcaption('');
                        setImage(null);
                        setprogress(0);
                    })})
        setcaption('')
        setImage(null)


    }
  return (
    <div >
        <button style={{color:'White', backgroundColor:'rgb(219, 136, 159)', border:'none', width:'100px', height:'30px'
            , borderRadius:'10px'}} onClick={()=>{
                const modal_Post = document.querySelector(".Modal_Postagem")
                modal_Post.close()}}>voltar</button>
        <div className='Div_Modal_Post'>

        <h2 style={{textAlign:'center', margin:'15px', color:'White' }}>Escolha uma foto</h2>
        <br/>
        <input style={{color:'White', border:'none' }} className='file-input' type='file' onChange={(e)=> { if(e.target.files[0]) {setImage(e.target.files[0])} }} />
        <br/>
        <textarea className='TextArea__NewPost' placeholder='Adicione uma Legenda'  id='filled-basic' label='Caption' onChange={(e)=>{setcaption(e.target.value)}} value={caption} />
        <br/>
        <progress className='progress' value={progress} max='100' />
        <br/>
        <button style={{color:'White', backgroundColor:'rgb(219, 136, 159)', border:'none', width:'100px', height:'30px'
            , borderRadius:'10px'
    }} onClick={handleUpload} >Postar</button>


        </div>
    </div>
  )
}

export default AddPost