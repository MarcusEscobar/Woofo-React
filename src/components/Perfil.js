import React from "react";

const Perfil = ({caption, imageURL}) => {

return (
    <div style={{background:'none'}} className='DivInterna_PostagemPerfi'>
      <div className='Div__Postagens__Perfil'>
        <img
        src={imageURL}
        alt='postagens'
        style={{alignSelf:'center'}}
        />
        <p className='post__text' style={{marginLeft:'20px', maxWidth:'500px'}} >{caption}</p>
      </div>
    </div>
  )
}

export default Perfil;