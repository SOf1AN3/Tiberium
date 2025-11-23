import Header from '../components/Header'
import ContactForm from '../components/ContactForm'
import backgroundImage from '../assets/background.jpg'

const Contact = () => {
     return (
          <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
               <div
                    className="background-fixe"
                    style={{
                         backgroundImage: `url(${backgroundImage})`,
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         width: '100%',
                         height: '100%',
                         objectFit: 'cover',
                         transform: 'translate(-50%, -50%)',
                         zIndex: '-1',
                         opacity: '0.1'
                    }}
               ></div>
               <Header />
               <ContactForm />
          </div>
     )
}

export default Contact