import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import ContactForm from '../components/ContactForm';

const Contact = () => {
   return (
      <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
         <div
            className="background-fixe"
            style={{
               backgroundImage: 'url(/assets/background.jpg)',
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
   );
};

export async function getStaticProps({ locale }) {
   return {
      props: {
         ...(await serverSideTranslations(locale, ['common', 'translation'])),
      },
   };
}

export default Contact;
