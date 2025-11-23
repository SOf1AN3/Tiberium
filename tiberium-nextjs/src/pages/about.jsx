import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
   const { t } = useTranslation();

   return (
      <>
         <div className="relative min-h-screen">
            <div
               className="background-fixe"
               style={{ backgroundImage: 'url(/assets/background.jpg)' }}
            ></div>
            <div className="relative z-10">
               <Header />
               <div className="container-about">
                  <h1 className='title'>{t('about_main_title')}</h1>
                  <h1>{t('about_title')}</h1>
                  <p>{t('about_desc')}</p>

                  <h1>{t('about_approach_title')}</h1>
                  <ul className='about_approach_list'>
                     <li><p>{t('about_approach_list_1')}</p></li>
                     <li><p>{t('about_approach_list_2')}</p></li>
                     <li><p>{t('about_approach_list_3')}</p></li>
                  </ul>
                  <h1>{t('about_team_title')}</h1>
                  <p>{t('about_team_desc')}</p>
               </div>
               <Footer />
            </div>
         </div>
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

export default About;
