import React, { useEffect } from "react";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import AddPost from "./AddPost";
import Posts from "./Posts";

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
console.log(user)

db.collection('Users')
const signup = (e) =>{
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            const Id_Div_Login = document.getElementById('class_Div_Login')
            const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
            Id_Div_Login.classList.add('Hide')
            Id_Div_Cadastro.classList.add('Hide')
            db.collection("Users").doc(username).set({
                photo: "https://firebasestorage.googleapis.com/v0/b/woof0-75c1f.appspot.com/o/images%2F2.png?alt=media&token=9c62023a-70bb-406e-aec8-6775151b5b17",
                nome: username,
                email: email,
            })

            return authUser.user.updateProfile({
                displayName:username,
            })
            
        }).then(()=>{
            window.location.reload()
        }).catch((e)=>alert(e.message))
}

const signin = (e) =>{
    e.preventDefault()
    const Id_Div_Login = document.getElementById('class_Div_Login');
    const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
    Id_Div_Login.classList.add('Hide');
    Id_Div_Cadastro.classList.add('Hide');
    auth.signInWithEmailAndPassword(email,password).then(()=>{
        const Id_Div_Login = document.getElementById('class_Div_Login')
        const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
        Id_Div_Login.classList.add('Hide')
        Id_Div_Cadastro.classList.add('Hide')

    })
    .catch((e)=>alert(e.message))
}

useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authuser)=>{
            if(authuser) {
                setuser(authuser)
                
            }
            else{
                setuser(null)
            }
        })
    return()=>{
        unsubscribe()
    };
}, [])

useEffect(()=>{
    db.collection("posts")
    .orderBy("timestamp", 'desc').
    onSnapshot((snapshot)=>{
        setPosts(
            snapshot.docs.map((doc)=> ({
                id: doc.id,
                post: doc.data(),
            }))
        );
    });
},[]);

const MudarAvatar=()=>{
    storage.ref(`Avatares/${avatar.name}`).put(avatar).then(()=>{
        console.log('Foto Enviada')
        storage.ref("Avatares").child(avatar.name).getDownloadURL().then((url)=>{
            console.log('Url:', url)
            db.collection('Users').doc(user.displayName).update({
                photo:url
            })

        })

    })   
}

return (
    <div className='app'>
            <div className='Hide'>   
                <input type='file' onChange={(e)=> { if(e.target.files[0]) {setavatar(e.target.files[0])} }} />
                <button onClick={MudarAvatar}>Button</button>           
            </div>
        <div className='app__header'>

            
            <div className="div__img">
                <img
                src={require('./static/LOGINSmallT.png')}
                onClick={()=>{}} />
                
            </div>

            
            {user ? <> {/* User Logado */}
            <div className="ButtonPost_Div" >
                <button className="ButtonPost" onClick={()=>{
                    const show_Id_Form_Div_Envio= document.getElementById('Id_Div_form_envio');
                    show_Id_Form_Div_Envio.classList.remove('Hide');
                    const Hide_Id_Div_feed= document.getElementById('Id_Div_Feed');
                    Hide_Id_Div_feed.style.display='none'
                    }}>Postar</button>
            </div>
            <div className="User_LogOut_Div" >
                <p className="WelcomeUser">Bem vindo {user.displayName}</p>
                <button className="ButtonHead" onClick={()=>{ 
                    
                    auth.signOut()}} >Logout</button>
            </div>
            </>:<>
            <div>
                <button className="ButtonHead" onClick={()=>{
                    const Id_Div_Login = document.getElementById('class_Div_Login')
                    const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
                    Id_Div_Login.classList.remove('Hide')
                    Id_Div_Cadastro.classList.add('Hide')
                }}>Login</button>
                    <span>&nbsp;&nbsp;</span>
                <button className="ButtonHead" onClick={()=>{
                    const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
                    const Id_Div_Login = document.getElementById('class_Div_Login')
                    Id_Div_Cadastro.classList.remove('Hide')
                    Id_Div_Login.classList.add('Hide')
                    
                }}>Cadastro</button>
            </div>
            </>
            }
        </div>
        {user && user.displayName ? <>
            <div id="Id_Div_form_envio" className='Hide'>
                <AddPost username={ user.displayName } />
            </div>               
            <div id='Id_Div_Feed' className="feed">
                
                {posts.map(({id, post}) => (
                 
                 <Posts
                     info={db.collection('Users').doc(`${post.userName}`).get()}
                     foto={user.photoURL}
                     key={id}
                     postId= {id}    
                     user={user}  
                     userName={post.userName}
                     caption={post.caption}
                     imageURL={post.imageURL}
                 />))}
            </div>    

        </> :
            <>
                <div className="UserCred">
                    <div id="class_Div_Cadastro" className="Hide">
                        <h1 className="titulo-cadastro">Vamos começar a aventura.</h1>
                        <form className="signup">
                            <input placeholder='Nome' type="text" className="InputGeneric" value={username} onChange={(e)=> { setusername(e.target.value) }} ></input><br/>
                            <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/>
                            <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                            <button type="submit" className="submitButton" onClick={signup}>Cadastrar!</button>
                        </form>
                    </div>
                    <div id="class_Div_Login">
                    <h1 className="titulo">Bem-vindo(a) ao Woofo!</h1>
                    <p className="paragrafo-login">A rede para seu melhor amigo.</p>
                        <form className="signin">
                            <input placeholder='Email' type="email" className="InputGeneric" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/><span>&nbsp;</span>
                            <input placeholder='Senha' type="password" className="InputGeneric" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                            <button type="submit" className="submitButton" onClick={signin}>Entrar!</button>
                        </form>
                    </div>
                </div>
            </>}

    </div>
  )
}

export default Home;
