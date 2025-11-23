import React from 'react'
import Header from '../components/Header'
import backgroundImage from '../assets/background.jpg'
import Inscription from '../components/Inscription'

const InscriptionPage = () => {
     return (
          <>
               <div
                    className="background-fixe"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
               ></div>
               <Header />
               <Inscription />
          </>
     )
}

export default InscriptionPage