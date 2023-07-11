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

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const storage = firebase.storage()
const db = app.firestore()

const Home =()=>{
  const [username,setusername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassord] = useState('')
  const [user, setuser] = useState(null)
  const [posts, setPosts] = useState([])
  const [home, setHome] = useState(true)
  const [postagensPerfil, setPostagensPerfil] = useState([]) 
  const [fotoPerfil, setFotoPerfil] = useState('')
  const [nomePerfil, setNomePerfil] = useState('')
  const [emailPerfil, setEmailPerfil] = useState('')
  const [bioPerfil, setBioPerfil] = useState('')
  const [avatar,setavatar] = useState(null)
  const [novoNome, setNovoNome] = useState('')
  const [novaBio, setNovaBio] = useState('')

function signup(e){
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            db.collection("Users").doc(email).set({
                photo: "https://firebasestorage.googleapis.com/v0/b/woof0-75c1f.appspot.com/o/Avatares%2FLogoLogin2.png?alt=media&token=8bbf58a5-deca-4874-9d68-e5a43975a747",
                bio:'Olá, eu estou na Woofo!! E esse é  meu perfil.',
                nome: username,
                email: email,})
            return authUser.user.updateProfile({
                displayName:username,
            })
        }).then(()=>{document.querySelector(".Modal_Cadastro").close()
            window.location.reload()
        }).catch((e)=>{alert(e.message); window.location.reload()})
        setEmail('')
        setPassord('')
        setusername('')
        document.querySelector(".Modal_Cadastro").close()
        document.querySelector(".Modal_Login").close()
        setHome(true)
}
     

function signin(e){
    e.preventDefault()
    auth.signInWithEmailAndPassword(email,password).then(()=>{
        document.querySelector(".Modal_Login").close()})
    .catch((e)=>{alert(e.message);window.location.reload()})
    setEmail('')
    setPassord('')
    document.querySelector(".Modal_Cadastro").close()
    document.querySelector(".Modal_Login").close()
    setHome(true)
}
useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authuser)=>{
            if(authuser) {
             setuser(authuser)}
            else{
                setuser(null)}})
    return()=>{
        unsubscribe()};},[])
useEffect(()=>{
    db.collection("posts").orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
        setPosts(
            snapshot.docs.map((doc)=>({
                id: doc.id,
                post: doc.data(),
            })));
        });},[]);
function MudarAvatar(e){
    e.preventDefault()
    storage.ref(`Avatares/${avatar.name}`).put(avatar).then(()=>{
        storage.ref("Avatares").child(avatar.name).getDownloadURL().then((url)=>{
            db.collection('Users').doc(user.email).update({
                photo:url}).then(()=>{irPerfil(user.email);document.querySelector(".Modal_MudarFoto").close()})})})}

function MudarNome(e){
    e.preventDefault()
    db.collection('Users').doc(user.email).update({
        nome:novoNome,
    }).then(()=>{irPerfil(user.email);document.querySelector(".Modal_MudarNome").close()})}

function MudarBio(e){
    e.preventDefault()
    db.collection('Users').doc(user.email).update({
        bio:novaBio,
    }).then(()=>{irPerfil(user.email);document.querySelector(".Modal_MudarBio").close()})}

function irPerfil(usuario){
    const userRef =db.collection('Users').doc(usuario)
    userRef.get().then((infoUser)=>{
        setHome(false)
        setFotoPerfil(infoUser.data().photo)
        setNomePerfil(infoUser.data().nome)
        setBioPerfil(infoUser.data().bio)
        setEmailPerfil(infoUser.data().email)})
    userRef.collection('Postagens').orderBy("timestamp", 'desc').onSnapshot((snapshot)=>{
    setPostagensPerfil(snapshot.docs.map((doc)=>({postagens: doc.data()})))})}

function trocarCadastro(e){
    e.preventDefault()
    document.querySelector(".Modal_Cadastro").showModal()
    document.querySelector(".Modal_Login").close()
}

function trocarLogin(e){
    e.preventDefault()
    document.querySelector(".Modal_Cadastro").close()
    document.querySelector(".Modal_Login").showModal()
}
return (
    <div>
        {user && user.displayName ? <>
            <dialog style={{background:'#676f9d'}} className="Modal_Postagem">
                <AddPost username={ user.displayName } userEmail={user.email}/>               
            </dialog>
            <div className="Display__home">
                <div className='Barra_lateral'>
                    <div className="Elements_Barra_Lateral" style={{cursor:'pointer'}} >
                        <a href="/#" style={{background:'none', textDecoration:'none', display:'flex'}}>
                        <img
                            style={{height:'80px', background:'none'}}
                            src={require('./static/Logo Branca.png')}
                            alt="Logo Woofo"
                        /><p id="P_Woofo" className="P_Woofo">Woofo</p>
                        </a>
                    </div>

                    <div className="Elements_Barra_Lateral" style={{cursor:'pointer'}}> 
                        <img
                            style={{height:'80px', borderRadius:'100%', background:'none'}}
                            src={require('./static/IconePerfil.png')}
                            alt="Logo Woofo"
                            onClick={()=>{irPerfil(user.email)}}
                        /><p onClick={()=>{irPerfil(user.email)}} className="P_BarraLateral" >Perfil</p>
                    </div>

                    <div className="Elements_Barra_Lateral" style={{cursor:'pointer'}}>
                        <img
                            style={{height:'80px', background:'none'}}
                            src={require('./static/post.png')}
                            alt="Logo Woofo"
                            onClick={()=>{document.querySelector(".Modal_Postagem").showModal()}}
                        /><p onClick={()=>{document.querySelector(".Modal_Postagem").showModal()}} className="P_BarraLateral">Postar</p>
                    </div>

                    <div className="Elements_Barra_Lateral" style={{cursor:'pointer'}}>
                        <img
                            style={{height:'80px', background:'none'}}
                            src={require('./static/IconeHome.png')}
                            alt="Logo Woofo"
                            onClick={()=>{setHome(true)}}
                        /><p onClick={()=>{setHome(true)}} className="P_BarraLateral">Home</p>
                    </div>

                    <div className="Elements_Barra_Lateral" style={{cursor:'pointer'}}>
                        <img
                            style={{height:'80px', background:'none'}}
                            src={require('./static/logout.png')}
                            alt="Logo Woofo"
                            onClick={()=>{auth.signOut()}}
                        /><p onClick={()=>{auth.signOut()}} className="P_BarraLateral" >Sair</p>
                    </div>
                </div>
                {home ? <>
                    {posts[0]?<>
                        <div className="main__Home">
                            <div id='Id_Div_Feed' className="feed">
                                {posts.map(({id, post}) => (
                                <Posts
                                    key={id}
                                    tokenPost = {post.tokenPost}
                                    foto={user.photoURL}
                                    user={user.email}
                                    userLogName={user.displayName}  
                                    userName={post.userName}
                                    userEmail={post.userEmail}
                                    caption={post.caption}
                                    imageURL={post.imageURL}
                                    irPerfil= {irPerfil}
                                />))}
                            </div>           
                        </div>
                    </>:<><div className="fundoNuvem"></div></>}
                </>:<>
                    <dialog style={{width:'300px' , height:'250px', background:'#676f9d'}} className="Modal_MudarBio">
                            <button className="voltar" onClick={()=>{document.querySelector(".Modal_MudarBio").close()}} >voltar</button> 
                        <div style={{background:'none' ,height:'200px' , display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <textarea placeholder="Insira uma Biografia" className='TextArea__NewPost' style={{width:'250px'}} value={novaBio} onChange={(e)=> {setNovaBio(e.target.value) }} />
                            <button className="Button_ModalPerfil" style={{height:'30px', marginTop:'20px'}} onClick={MudarBio}>Alterar Bio</button>
                        </div>   
                    </dialog>
                    <dialog style={{width:'300px' , height:'250px', background:'#676f9d'}} className="Modal_MudarNome">
                            <button className="voltar" onClick={()=>{document.querySelector(".Modal_MudarNome").close()}} >voltar</button>
                        <div style={{background:'none' ,height:'200px' , display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <textarea placeholder="Insira uma Nome" className='TextArea__NewPost' style={{width:'250px', marginBottom:'20px'}} value={novoNome} onChange={(e)=> {setNovoNome(e.target.value) }} />
                            {novoNome!==''?<>
                                <button className="Button_ModalPerfil" style={{height:'30px'}} onClick={MudarNome}>Alterar Nome</button>
                            </>:<></>}
                        </div>   
                    </dialog>
                    <dialog style={{width:'300px' , height:'250px', background:'#676f9d'}} className="Modal_MudarFoto">
                            <button className="voltar" onClick={()=>{document.querySelector(".Modal_MudarFoto").close()}} >voltar</button>
                        <div style={{background:'none' ,height:'200px' , display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
                            <input type='file' id="inputAvatar" style={{display:'none'}} onChange={(e)=> { if(e.target.files[0]) {setavatar(e.target.files[0])} }} />
                            <label className='Label_InputFile' style={{height:'40px'}} htmlFor="inputAvatar">Escolha uma foto</label>
                            {avatar !== null?<><p style={{background:'none', color:'white'}} >Imagem selecionada: {avatar.name}</p>
                            <button className="Button_ModalPerfil" style={{height:'30px', marginTop:'20px'}} onClick={MudarAvatar}>Alterar foto</button>
                            </>:<></>}

                        </div>   
                    </dialog>
                {postagensPerfil[0]?<>
                    <div className="HeaderPerfil">
                        <div className="Div_Header_Foto_nome">
                            <div className="Div_Header_Perfil">
                                <img className="Foto_Header_Perfil"
                                    src={fotoPerfil}
                                    alt="Avatar"
                                />
                            </div>
                            {emailPerfil === user.email?<>
                                <div style={{display:'flex', flexDirection:'column', background:'none'}}>
                                    <div style={{background:'none', maxWidth:'70ch', height:'280px'}} >
                                        <h1 className="H1_Header">{nomePerfil}</h1>
                                        <p className="P_BioPerfil" >{bioPerfil}</p>
                                    </div>
                                    <div style={{height:'10px', background:'none'}} >
                                        <button className="Button_EditPerfil" onClick={()=>{document.querySelector(".ModalEditPerfil").showModal()}}>Editar perfil</button>
                                    </div>
                                </div>
                            </>:<>
                                <div style={{display:'flex', flexDirection:'column', background:'none'}}>
                                    <div style={{background:'none', maxWidth:'70ch', height:'280px'}} >
                                        <h1 className="H1_Header">{nomePerfil}</h1>
                                        <p className="P_BioPerfil" >{bioPerfil}</p>
                                    </div>
                                </div>
                            </>}
                        </div>
                    </div>
                    <dialog className="ModalEditPerfil" style={{width:'250px', height:'200px', backgroundColor:'#676f9d'}}>
                        <div className="Div_EditPerfil">
                            <button className="voltar" onClick={()=>{document.querySelector(".ModalEditPerfil").close()}} >voltar</button><br/>
                            <button className="ButtonEdit" onClick={()=>{document.querySelector(".Modal_MudarBio").showModal(); setNovaBio('')}}>Alterar Bio</button><br/>
                            <button className="ButtonEdit" onClick={()=>{document.querySelector(".Modal_MudarNome").showModal(); setNovoNome('')}}>Alterar Nome</button><br/>
                            <button className="ButtonEdit" onClick={()=>{document.querySelector(".Modal_MudarFoto").showModal(); setavatar(null)}}>Alterar foto de Perfil</button>
                        </div>
                    </dialog>
                    <div className="Perfil">
                    
                        <div className="Div_Postagens_Perfil">
                            {postagensPerfil.map(({postagens})=>(
                                <Perfil 
                                key={postagens.tokenPost}
                                username={postagens.userName}
                                userEmail={postagens.userEmail} 
                                caption={postagens.caption}
                                imageURL={postagens.imageURL}
                                tokenPost = {postagens.tokenPost}
                                />))}
                        </div>
                    </div>     
                </>:<>
                    <div className="fundoNuvem">
                        <dialog open style={{background:'#676f9d', alignSelf:'center', justifySelf:'center,', }} className="ModalPerfil">
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center',background:'none'}} >
                                <img
                                style={{background:'none',height:'60px'}}
                                src={require('./static/Logo Branca.png')}
                                alt="Logo"/>
                            </div>
                            <p className="P_ModalPerfil" >Seu perfil está vazio,</p>
                            <p className="P_ModalPerfil" >faça uma postagem</p>
                            <button className="Button_ModalPerfil" onClick={()=>{document.querySelector(".Modal_Postagem").showModal()}} >Postar</button>
                        </dialog>
                    </div>
                </>}
                </>}
            </div>
        </>:<>
        <div className="fundoNuvem">
            <dialog open style={{background:'#676f9d'}} className="Modal_Login">
                <form style={{background:'#676f9d'}} className="signin">
                    <img
                    style={{background:'#676f9d',height:'60px'}}
                    src={require('./static/Logo Branca.png')}
                    alt="Logo"
                    />
                    <h1 style={{background:'#676f9d'}} className="titulo">Bem-vindo(a) ao Woofo!</h1>
                    <p style={{background:'#676f9d'}} className="paragrafo-login">A rede para seu melhor amigo.</p>
                    <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/><span style={{background:'#676f9b'}}>&nbsp;</span>
                    <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                    <button type="submit" className="submitButton" onClick={signin}>Entrar!</button>
                    </form>
                    <div className="Div_TrocarButton">
                        <p style={{background:'#676f9d', color:'white', fontSize:'20px'}} >ainda não tem uma conta?</p>
                        <button className="Button_Trocar_loginCadastro" onClick={trocarCadastro}>cadastre-se</button>     
                    </div>
            </dialog>
                
            <dialog style={{background:'#676f9d'}} className="Modal_Cadastro">
                <form style={{background:'#676f9d'}} className="signup">
                <img
                    style={{background:'#676f9d',height:'60px'}}
                    src={require('./static/Logo Branca.png')}
                    alt='logo'
                    />
                <h1 style={{background:'#676f9d'}} className="titulo-cadastro">Vamos começar a aventura.</h1>
                    <input placeholder='Nome' type="text" className="InputGeneric" value={username} onChange={(e)=> { setusername(e.target.value) }} ></input><br/>
                    <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/>
                    <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                    <button type="submit" className="submitButton" onClick={signup}>Cadastrar!</button>
                </form>
                <div className="Div_TrocarButton">
                    <p style={{background:'#676f9d', color:'white', fontSize:'20px'}}>já tem uma conta?</p>
                    <button className="Button_Trocar_loginCadastro" onClick={trocarLogin}>Logar</button>   
                </div>
                
            </dialog> 
        </div>
    </>}
    </div>
)}
export default Home;


