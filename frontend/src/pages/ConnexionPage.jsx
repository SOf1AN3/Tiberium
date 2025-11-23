import Header from '../components/Header'
import Connexion from '../components/Connexion'
import backgroundImage from '../assets/background.jpg'

const ConnexionPage = () => {
     return (
          <div className="connexion-page">
               <div
                    className="background-fixe"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
               ></div>
               <Header />
               <div className="connexion-content">
                    <Connexion />
               </div>
          </div>
     )
}

export default ConnexionPage