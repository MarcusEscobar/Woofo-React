import React, { useEffect } from "react";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
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
const auth = firebase.auth()


const Home = () => {

  const [username,setusername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassord] = useState('')
  const [user, setuser] = useState(null)

const signup = (e) =>{
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            const Id_Div_Login = document.getElementById('class_Div_Login')
            const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
            Id_Div_Login.classList.add('Hide')
            Id_Div_Cadastro.classList.add('Hide')
            return authUser.user.updateProfile({
                displayName:username,
            })
            
        })
        .catch((e)=>alert(e.message))
}

const signin = (e) =>{
    e.preventDefault()
    const Id_Div_Login = document.getElementById('class_Div_Login')
    const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
    Id_Div_Login.classList.add('Hide')
    Id_Div_Cadastro.classList.add('Hide')
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
                console.log(authuser)
            }
            else{
                setuser(null)
            }
        })
    return()=>{
        unsubscribe()
    };
}, [])

  return (
    <div className='app'>
    
        <div className='app__header'>
            
            <div>
                <img
                src={require('./static/LOGINSmallT.png')}
                />
            </div>
            <h1>WOOFO</h1>
            
            {user ? <>
            <button onClick={()=>{
                const Id_Div_Post = document.getElementById('class_Div_Post')
                Id_Div_Post.classList.remove('Hide')

            }}>Postar</button>
            <h1>Bem vindo {user.displayName}</h1>
            <button onClick={()=>{ 
                const Id_Div_Post = document.getElementById('class_Div_Post')
                Id_Div_Post.classList.add('Hide')
                auth.signOut()
                 }} >Logout</button>
            </>:<>
            <button onClick={()=>{
                const Id_Div_Login = document.getElementById('class_Div_Login')
                const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
                Id_Div_Login.classList.remove('Hide')
                Id_Div_Cadastro.classList.add('Hide')
            }}>Logar</button>

            <button onClick={()=>{
                const Id_Div_Cadastro = document.getElementById('class_Div_Cadastro');
                const Id_Div_Login = document.getElementById('class_Div_Login')
                Id_Div_Cadastro.classList.remove('Hide')
                Id_Div_Login.classList.add('Hide')
            }}>Cadastro</button>
            </>
            }
        
        </div>
        <div id="class_Div_Cadastro" className="Hide">
            <h1>Sign In</h1>
            <form className="signup">
                <input placeholder='Nome' type="text" value={username} onChange={(e)=> { setusername(e.target.value) }} ></input><br/>
                <input placeholder='Email' type="email" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/>
                <input placeholder='Senha' type="password" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                <button type="submit" onClick={signup}>Sign Up</button>
            </form>
        </div>
        <div id="class_Div_Login" className="Hide">
            <h1>Sign Up</h1>
            <form className="signin">
                <input placeholder='Email' type="email" value={email} onChange={(e)=> { setEmail(e.target.value) }} ></input><br/>
                <input placeholder='Senha' type="password" value={password} onChange={(e)=> { setPassord(e.target.value) }} ></input><br/>
                <button type="submit" onClick={signin}>Sign In</button>
            </form>
        </div>
        <div id="class_Div_Post" className="Hide">
            <form id='post_Form'>
                <h2>Postar foto</h2>   
                <label for="image" class="labelInput">Escolha uma foto:</label>
                <input type="file" name="image" id="image" accept="image/*"/>
                <button type="submit">Postar</button>
            </form>

        </div>
    </div>
  )
}

export default Home;
