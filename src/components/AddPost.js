import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
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
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            userName: username})
                        const hide_Id_Form_Div_Envio= document.getElementById('Id_Div_form_envio');
                        hide_Id_Form_Div_Envio.classList.add('Hide');
                        const show_Id_Div_feed= document.getElementById('Id_Div_Feed');
                        show_Id_Div_feed.classList.remove('Hide');
                    })})
        setcaption('')
        setImage(null)


    }
  return (
    <div className='imagesupload'>
        <h2 style={{textAlign:'center', margin:'15px' }}>Add new post</h2>
        <br/>
        <input className='file-input' type='file' onChange={(e)=> { if(e.target.files[0]) {setImage(e.target.files[0])} }} />
        <br/>
        <textarea id='filled-basic' label='Caption' onChange={(e)=>{setcaption(e.target.value)}} value={caption} />
        <br/>
        <progress className='progress' value={progress} max='100' />
        <br/>
        <button onClick={handleUpload} >ADD POST</button>
    </div>
  )
}

export default AddPost