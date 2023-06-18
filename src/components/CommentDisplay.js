import React from 'react'

const CommentDisplay = ({comentado, user}) => {
  return (
    <div className='Div__CommentDisplay'>
        <p><b>{user}:</b> {comentado}</p>
    </div>
  )
}

export default CommentDisplay;