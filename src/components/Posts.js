import React, { useState } from 'react'

const Posts = ({ foto, info ,postID, user, userName, caption, imageURL}) => {

const [photo, setPhoto] = useState("")
info.then((r)=>{setPhoto(r.data())})
  return (
    <div className='post'>
        <div className='post__header'>
            <img className='avatar'
            src={photo.photo}
            alt={userName}/>
            <h3 className='Username'>{userName}</h3>
        </div>
        <img
            className='post__image'
            src={imageURL}
        />
        <p className='post__text'>
            <b className='Caption'>{userName} diz:&nbsp;</b>{caption}
        </p>
        <div className='post_comments'>
            {/*comentarios*/}
        </div>

    </div>
  )
}

export default Posts;