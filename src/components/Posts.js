import React from 'react'

const Posts = ({postID, user, userName, caption, imageURL}) => {

  return (
    <div className='post'>
        <div className='post__header'>
            <h3 className='Username'>{userName}</h3>
        </div>
        <img
            className='post__image'
            src={imageURL}
        />
        <p className='post__text'>
            <b className='Caption'>{userName}&nbsp;</b>{caption}
        </p>
        <div className='post_comments'>
            {/*comentarios*/}
        </div>

    </div>
  )
}

export default Posts;