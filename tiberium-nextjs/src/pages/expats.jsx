import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import ExpatsServices from '../components/ExpatsServices';
import Footer from '../components/Footer';

const Expats = () => {
   return (
      <div className="relative min-h-screen">
         <div
            className="background-fixe"
            style={{ backgroundImage: 'url(/assets/background.jpg)' }}
         ></div>
         <div className="relative z-10">
            <Header />
            <ExpatsServices />
         </div>
         <Footer />
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

export default Expats;
