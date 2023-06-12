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
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            userName: username})
                            .then(()=>{
                                window.location.reload()
                            })
                        setcaption('');
                        setImage(null);
                        setprogress(0);
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