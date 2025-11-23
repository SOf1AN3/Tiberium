import Header from '../components/Header'
import ExpatsServices from '../components/ExpatsServices'
import backgroundImage from '../assets/background.jpg'
import Footer from '../components/Footer'

const Expats = () => {
     return (
          <div className="relative min-h-screen">
               <div
                    className="background-fixe"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
               ></div>
               <div className="relative z-10">
                    <Header />
                    <ExpatsServices />
               </div>
               <Footer />
          </div>
     )
}

export default Expats