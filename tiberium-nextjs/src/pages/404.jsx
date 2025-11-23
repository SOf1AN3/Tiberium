import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
   const { t } = useTranslation();

   return (
      <>
         <Header />
         <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Go back to home</a>
         </div>
         <Footer />
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

export default NotFound;
