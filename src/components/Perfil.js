import React from 'react'

const Perfil = ({user}) => {
    console.log(user)
  return (
    <div>
        <p>
           esse é o perfil de: {user}
        </p>


    </div>
  )
}

export default Perfil;