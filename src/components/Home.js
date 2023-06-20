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
  const [postagensPerfil, setPostagensPerfil] = useState([]) 
  const [fotoPerfil, setFotoPerfil] = useState('')
  const [nomePerfil, setNomePerfil] = useState('')


const signup = (e) =>{
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            db.collection("Users").doc(username).set({
                photo: "https://firebasestorage.googleapis.com/v0/b/woof0-75c1f.appspot.com/o/images%2FLogoLogin2.png?alt=media&token=659f0964-4fb8-4d4f-a89a-e1ff11a6a053",
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
             setuser(authuser)
            db.collection('Users').doc(authuser.displayName).get().then((infoUser)=>{
                setFotoP(infoUser.data().photo)})}
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

const irPerfil = (usuario)=>{
            setNomePerfil(usuario)
            db.collection('Users').doc(usuario).get().then((infoUser)=>{
                setHome(false)
                setFotoPerfil(infoUser.data().photo)})
            db.collection('Users').doc(usuario).collection('Postagens').orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
                setPostagensPerfil(snapshot.docs.map((doc)=>({
                    postagens: doc.data()
                })))})}



return (
    <div className="HomeBody" >
    {home ? <>
    <button className="Hide" onClick={()=>{setHome(false)}}>Inverter</button>
        <div className='app__header'>
                <button className="Button__Woofo" onClick={()=>{window.location.reload()}} >Woofo</button>         
            {user ? <> {/* User Logado? */}
            <div className="ButtonPost_Div" >
                <button className="ButtonPost" onClick={()=>{
                    const modal_Post = document.querySelector(".Modal_Postagem")
                    modal_Post.showModal()}}>Postar</button>
            </div>
            <div className="Coluna_Header_Home">
                <div className="User_LogOut_Div" >
                    <img className="avatar" 
                        onClick={()=>{irPerfil(user.displayName)}}
                        src={fotoP}
                        alt="Avatar"
                    />
                    <button className="WelcomeUser" onClick={()=>{irPerfil(user.displayName)}}>{user.displayName}</button>
                </div>
                <button className="ButtonHead" onClick={()=>{auth.signOut()}} >Logout</button>
            </div>
            </>:<>
            <div className="Sign__Div" >
                <button className="ButtonHead" onClick={()=>{
                    const modal_Login = document.querySelector(".Modal_Login")
                    modal_Login.showModal()
                }}>Login</button>
                    <span style={{background: '#473170'}}>&nbsp;&nbsp;</span>
                <button className="ButtonHead" onClick={()=>{                     
                    const modal_Cadastro = document.querySelector(".Modal_Cadastro")
                    modal_Cadastro.showModal()
                }}>Cadastro</button>
            </div>
            </>}
        </div>
        {user && user.displayName ? <>
            <dialog style={{background:'#2E3351'}} className="Modal_Postagem">
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
                     irPerfil= {irPerfil}
                 />))}
            </div>           
            
        </>:<>   
        <div id="centerpoint">

            <dialog style={{background:'#2E3351'}} className="Modal_Login">
                <button className="voltar" onClick={()=>{
                     const modal_Login = document.querySelector(".Modal_Login")
                     modal_Login.close()
                }}>voltar</button>
                <form style={{background:'#2E3351'}} className="signin">
                    <h1 style={{background:'#2E3351'}} className="titulo">Bem-vindo(a) ao Woofo!</h1>
                    <p style={{background:'#2E3351'}} className="paragrafo-login">A rede para seu melhor amigo.</p>
                    <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/><span style={{background:'#2E3351'}}>&nbsp;</span>
                    <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                    <button type="submit" className="submitButton" onClick={signin}>Entrar!</button>
                </form>
            </dialog> 
            <dialog style={{background:'#2E3351'}} className="Modal_Cadastro">
                <button  className="voltar" onClick={()=>{
                     const modal_Cadastro = document.querySelector(".Modal_Cadastro")
                     modal_Cadastro.close()
                }}>voltar</button>
                <form style={{background:'#2E3351'}} className="signup">
                <h1 style={{background:'#2E3351'}} className="titulo-cadastro">Vamos começar a aventura.</h1>
                    <input placeholder='Nome' type="text" className="InputGeneric" value={username} onChange={(e)=> { setusername(e.target.value) }} ></input><br/>
                    <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/>
                    <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                    <button type="submit" className="submitButton" onClick={signup}>Cadastrar!</button>
                </form>
            </dialog>      

        </div>
        <div className="Div_Img_Login">
            <div className="Div_Text_Login">
                <h1 className="H1_Text_Login">Bem Vindo(a) ao woofo</h1>
                <p className="P_Text_Login">A Rede para seu melhor amigo!</p>
            </div>
            <img
            className="Img__Login"
            src={require('./static/LOGIN (1).png')}
            alt="Logo"
            />
        </div>
            </>}
    </>:<>
    <button 
    style={{color:'White', backgroundColor:'rgb(219, 136, 159)', border:'none', width:'100px', height:'30px', borderRadius:'10px', marginTop: '10px', marginLeft:'10px'}}
    onClick={()=>{setHome(true)}}>Home Page</button>
        <dialog>
            <div>   
                <input type='file' onChange={(e)=> { if(e.target.files[0]) {setavatar(e.target.files[0])} }} />
                <button onClick={MudarAvatar}>Button</button>
            </div>   
        </dialog>
        <div className="Div_Header_Foto_nome">
            <div className="Div_Header_Perfil">
                <img className="Foto_Header_Perfil"
                    src={fotoP}
                    alt="Avatar"
                />
            </div>
            <h1 className="H1_Header">{nomePerfil}</h1>  
        </div>
        <div className="Perfil">
            <div className="Div_Postagens_Perfil">
                {postagensPerfil.map(({postagens})=>(
                    <Perfil 
                    user={postagens.displayName} 
                    foto = {fotoPerfil}
                    caption={postagens.caption}
                    imageURL={postagens.imageURL}
                    tokenPost = {postagens.tokenPost}
                    />))}
            </div>
        </div>          
    </>}
    </div>
)}
export default Home;


