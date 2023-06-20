import React from 'react'

const Perfil = ({user, fotoP, caption, imageURL, tokenPost}) => {
  return (
    <div className='DivInterna_PostagemPerfil'>
      <div  className='Div__Postagens__Perfil'>
          <img
            src={imageURL}
            alt='postagens'
          />
      </div>
    </div>
  )
}

export default Perfil;