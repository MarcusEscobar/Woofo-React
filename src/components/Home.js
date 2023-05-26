import React, {useState} from 'react';
import { Button, Modal, Input } from '@mui/material';
import { makeStyles } from '@mui/styles';



function getModalStyle(){
  return{
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
  };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2 px solid #000",
        boxShadow: theme.shadow[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Home = () => {

  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [openSignup,setOpenSignup] = useState(false)
  const [openSignip,setOpenSignin] = useState(false)

  const [username,setusername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassord] = useState('')

  return (
    <div className='app'>
        <Modal open={openSignup} onClose={()=>{setOpenSignup(false)}}>
            <div style={modalStyle} className={classes.paper}>
                <form className='app__signup'>
                    <center>
                        <img
                        className='app__headerImage'
                        src={require('./static/LOGINSmallT.png')}
                        alt='logo'
                        />
                    </center>
                    <Input
                        placeholder='Name'
                        type='text'
                        value={username}
                        onChange={(e) => { setusername(e.target.value) }}
                    />
                    <Input
                        placeholder='Email'
                        type='text'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <Input
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={(e) => { setPassord(e.target.value) }}
                    />

                </form>
            </div>
        </Modal>

        <div className='app__header'>
            <img
                className='app__headerImage'
                src={require('./static/LOGINSmallT.png')}
                alt='logo'
            />

            <div>
              <Button>Sign In</Button>
              <span>&nbsp;&nbsp;</span>
              <Button>Sign Up</Button>
            </div>
        </div>  
    </div>
  )
}

export default Home;