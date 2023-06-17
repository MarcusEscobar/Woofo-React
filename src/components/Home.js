import React, { useEffect } from "react";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import AddPost from "./AddPost";
import Posts from "./Posts";
import Perfil from './Perfil';

import {firebaseConfig} from './config.js'
  
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const storage = firebase.storage()
const db = app.firestore()


const Home = () => {

  const [username,setusername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassord] = useState('')
  const [user, setuser] = useState(null)
  const [posts, setPosts] = useState([])
  const [avatar,setavatar] = useState(null)
  const [home, setHome] = useState(true)
  const [fotoP, setFotoP] = useState('')


const signup = (e) =>{
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            db.collection("Users").doc(username).set({
                photo: "https://firebasestorage.googleapis.com/v0/b/woof0-75c1f.appspot.com/o/images%2F2.png?alt=media&token=9c62023a-70bb-406e-aec8-6775151b5b17",
                nome: username,
                email: email,})
            return authUser.user.updateProfile({
                displayName:username,})
        }).then(()=>{
            const modal_Cadastro = document.querySelector(".Modal_Cadastro")
            modal_Cadastro.close()
            window.location.reload()
        }).catch((e)=>alert(e.message))}
const signin = (e) =>{
    e.preventDefault()
    auth.signInWithEmailAndPassword(email,password).then(()=>{
        const modal_Login = document.querySelector(".Modal_Login")
        modal_Login.close()})
    .catch((e)=>alert(e.message))}
useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authuser)=>{
            if(authuser) {
                setuser(authuser)}
            else{
                setuser(null)}})
    return()=>{
        unsubscribe()};}, [])
useEffect(()=>{
    db.collection("posts").orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
        setPosts(
            snapshot.docs.map((doc)=>({
                id: doc.id,
                post: doc.data(),
            })));
        });},[]);
const MudarAvatar=()=>{
    storage.ref(`Avatares/${avatar.name}`).put(avatar).then(()=>{
        console.log('Foto Enviada')
        storage.ref("Avatares").child(avatar.name).getDownloadURL().then((url)=>{
            console.log('Url:', url)
            db.collection('Users').doc(user.displayName).update({
                photo:url})})})}


const irPerfil = ()=>{
    db.collection('Users').doc(user.displayName).get().then((infoUser)=>{
        setFotoP(infoUser.data().photo)
        setHome(false)
    })

}


return (
    <div className="HomeBody" >
    {home ? <>
    <button className="Hide" onClick={()=>{setHome(false)}}>Inverter</button>
        <div className='app__header'>
            <div className="div__img">
                <img
                src={require('./static/LOGINSmallT.png')}
                alt="logo"
                onClick={()=>{window.location.reload()}} />         
            </div>
            {user ? <> {/* User Logado? */}
            <div className="ButtonPost_Div" >
                <button className="ButtonPost" onClick={()=>{
                    const modal_Post = document.querySelector(".Modal_Postagem")
                    modal_Post.showModal()}}>Postar</button>
            </div>
            <div className="User_LogOut_Div" >
                <p ></p>
                <button className="WelcomeUser" onClick={irPerfil} style={{border:'none'}} >Bem vindo {user.displayName}</button>
                <button className="ButtonHead" onClick={()=>{ 
                    auth.signOut()}} >Logout</button>
            </div>
            </>:<>
            <div>
                <button className="ButtonHead" onClick={()=>{
                    const modal_Login = document.querySelector(".Modal_Login")
                    modal_Login.showModal()
                }}>Login</button>
                    <span>&nbsp;&nbsp;</span>
                <button className="ButtonHead" onClick={()=>{                     
                    const modal_Cadastro = document.querySelector(".Modal_Cadastro")
                    modal_Cadastro.showModal()
                }}>Cadastro</button>
            </div>
            </>}
        </div>
        {user && user.displayName ? <>
            <dialog className="Modal_Postagem">
           
                <AddPost username={ user.displayName }/>
                               
            </dialog>
            
            <div id='Id_Div_Feed' className="feed">
                {posts.map(({id, post}) => (
                 <Posts
                     key={id}  
                     tokenPost = {post.tokenPost}
                     RefAvatar={db.collection('Users').doc(`${post.userName}`).get()}
                     refLike={db.collection("posts").doc(post.tokenPost).collection('likes').doc('like').get()}
                     foto={user.photoURL}
                     user={user.displayName}  
                     userName={post.userName}
                     caption={post.caption}
                     imageURL={post.imageURL}
                 />))}
            </div>           
            
        </>:<>   
        <div id="centerpoint">

            <dialog className="Modal_Login">
                <button className="voltar" onClick={()=>{
                     const modal_Login = document.querySelector(".Modal_Login")
                     modal_Login.close()
                }}>voltar</button>
                <form className="signin">
                    <h1 className="titulo">Bem-vindo(a) ao Woofo!</h1>
                    <p className="paragrafo-login">A rede para seu melhor amigo.</p>
                    <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/><span>&nbsp;</span>
                    <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                    <button type="submit" className="submitButton" onClick={signin}>Entrar!</button>
                </form>
            </dialog> 
            <dialog className="Modal_Cadastro">
                <button className="voltar" onClick={()=>{
                     const modal_Cadastro = document.querySelector(".Modal_Cadastro")
                     modal_Cadastro.close()
                }}>voltar</button>
                <form className="signup">
                <h1 className="titulo-cadastro">Vamos começar a aventura.</h1>
                    <input placeholder='Nome' type="text" className="InputGeneric" value={username} onChange={(e)=> { setusername(e.target.value) }} ></input><br/>
                    <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/>
                    <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                    <button type="submit" className="submitButton" onClick={signup}>Cadastrar!</button>
                </form>
            </dialog>      

        </div>
            </>}
    </>:<>
    <button onClick={()=>{setHome(true)}}>Home</button>
            <div>   
                <input type='file' onChange={(e)=> { if(e.target.files[0]) {setavatar(e.target.files[0])} }} />
                <button onClick={MudarAvatar}>Button</button>           
            </div>
            <div>
                <Perfil 
                user={user.displayName} 
                foto = {fotoP}
                />
            </div>
            
    </>}
    </div>
)}

export default Home;
