import React from 'react'

const CommentDisplay = ({comentado, user, userName}) => {
  return (
    <div className='Div_All_comments'>
        <p className='comment__text'><b  style={{background: '#4E527B'}} >{userName}:</b> {comentado}</p>
    </div>
  )
}

export default CommentDisplay;