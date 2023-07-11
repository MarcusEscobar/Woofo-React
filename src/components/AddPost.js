import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
const db = app.firestore()

const AddPost = ({username, userEmail}) => {
    
    const [caption,setcaption] = useState('')
    const [progress,setprogress] = useState(0)
    const [image,setImage] = useState(null)

    function Upload(){
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
                        DocRef.collection('likes').doc('like').set({
                            like:0,
                            user: []
                           }).then(()=>{
                               DocRef.set({
                                   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                   caption: caption,
                                   imageURL: url,
                                   userName: username,
                                   userEmail: userEmail,
                                   tokenPost:TokenPost }).then(()=>{
                                    db.collection('Users').doc(userEmail).collection('Postagens').doc(TokenPost).set({
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    caption: caption,
                                    imageURL: url,
                                    userName: username,
                                    userEmail: userEmail,
                                    tokenPost:TokenPost,
                                }).then(()=>{document.querySelector(".Modal_Postagem").close()
                            setcaption('');
                            setImage(null);
                            setprogress(0);})})})})
                        setcaption('');
                        setImage(null);
                        setprogress(0);})         
                    setcaption('')
                    setImage(null)
                    setprogress(0)}
  return (
    <div style={{background:'#676f9d'}} >
        <button style={{color:'White', backgroundColor:'rgb(219, 136, 159)', border:'none', width:'100px', height:'30px', borderRadius:'10px', cursor:'pointer'}} onClick={()=>{
                  document.querySelector(".Modal_Postagem").close()}}>voltar</button>
        <div style={{background:'#676f9d'}} className='Div_Modal_Post'>
        <br/>
        <input style={{display:'none'}} id='file-input' className='file-input' type='file' onChange={(e)=> { if(e.target.files[0]) {setImage(e.target.files[0])} }} />
        <label className='Label_InputFile'  htmlFor="file-input">Escolha uma foto</label>
        {image !== null?<><p style={{background:'none', color:'white'}} >Imagem selecionada: {image.name}</p></>:<></>}
        <br/>
        <textarea className='TextArea__NewPost' placeholder='Adicione uma Legenda'  id='filled-basic' label='Caption' onChange={(e)=>{setcaption(e.target.value)}} value={caption} />
        <br/>
        <progress className='progress' value={progress} max='100'></progress>
        <br/>
        {image !== null?<>
            <button className='ComImg_Button' style={{color:'White', backgroundColor:'rgb(219, 136, 159)', border:'none', width:'100px', height:'30px',borderRadius:'10px'
        }} onClick={Upload} >Postar</button>
        </>:<>
            <button className='NoImg_Button'>Postar</button>
        </>}


        </div>
    </div>
  )
}

export default AddPost