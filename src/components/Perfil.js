import React from 'react'

const Perfil = ({user, fotoP}) => {
  return (
    <div>
        <p>
           esse é o perfil de: {user}
        </p>
        <img
          src={fotoP}
        />


    </div>
  )
}

export default Perfil;