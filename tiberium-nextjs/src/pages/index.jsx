import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
   const { t } = useTranslation('translation');

   return (
      <div className='background'>
         <div className='background-overlay'></div>
         <Header />
         <div className='background-pos'>
            <h1 className='home-title no-select'>{t('home_title')}</h1>
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

export default Home;
