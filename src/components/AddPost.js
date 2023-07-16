import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import {firebaseConfig} from './config.js'

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
const db = app.firestore()

const AddPost = ({username, userEmail, attPerfil}) => {
    
    const [caption,setcaption] = useState('')
    const [progress,setprogress] = useState(0)
    const [image,setImage] = useState(null)
    const [labelFile, setLabelFile] = useState('')

    function Upload(){
        setLabelFile('')
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
                                }).then(()=>{document.querySelector(".Modal_Postagem").close(); attPerfil(userEmail);
                            setcaption('');
                            setImage(null);
                            setprogress(0);})})})})
                        setcaption('');
                        setImage(null);
                        setprogress(0);})         
                    setcaption('')
                    setImage(null)
                    setprogress(0)}


useEffect(()=>{
    if(image){
        const reader = new FileReader();
        reader.addEventListener("load", function (e) {
          const readerTarget = e.target;
          setLabelFile('');
          setLabelFile(readerTarget.result);
        });

        reader.readAsDataURL(image);
      } else {
        setLabelFile('');
      }
},[image]);    
  return (
    <div style={{background:'#676f9d'}} >
        <div style={{ display:'flex',justifyContent:'end', background:'none'}} >
            <button style={{color:'white', fontWeight:'bold', fontSize:'25px', background:'none', border:'none', width:'30px', height:'30px', cursor:'pointer',}} onClick={()=>{
                document.querySelector(".Modal_Postagem").close()
                setcaption('');setImage(null);setprogress(0);setLabelFile('')}}>x</button>
        </div>
        <div style={{background:'#676f9d'}} className='Div_Modal_Post'>
        <br/>
        <input style={{display:'none'}} id='file-input' className='file-input' type='file' accept='image/*' onChange={(e)=> { if(e.target.files[0]){setImage(e.target.files[0])}}}/>
        {labelFile ? <>
            <label className='Label_InputFile' htmlFor="file-input" onClick={()=>{setcaption(''); setImage(null); setprogress(0);}}>
                <img className='picture_image'
                    src={labelFile}
                    alt='escolha uma foto'
                />
            </label>
        </>:<>
        <label className='Label_InputFile' htmlFor="file-input" onClick={()=>{
            setcaption('');
            setImage(null);
            setprogress(0);
        }} >Escolha uma imagem</label>
        </>}
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