import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import Cards from '../components/Cards';

const Services = () => {
   return (
      <>
         <div className="services-wrapper">
            <div
               className="background-fixe"
               style={{ backgroundImage: 'url(/assets/background.jpg)' }}
            ></div>
            <Header />
            <Cards />
         </div>
         <footer className='services-footer'>
            <ul>
               <li>Tiberium Consulting</li>
               <li>Copyrights © Tiberium Consulting 2024</li>
            </ul>
         </footer>
      </>
   );
};

export async function getStaticProps({ locale }) {
   return {
      props: {
         ...(await serverSideTranslations(locale, ['common', 'translation'])),
      },
   };
}

export default Services;
