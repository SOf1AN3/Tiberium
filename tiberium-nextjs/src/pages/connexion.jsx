import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Connexion = () => {
   const { t } = useTranslation();
   const { login } = useAuth();
   const router = useRouter();
   const [formData, setFormData] = useState({
      email: '',
      password: '',
      rester: false
   });
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({
         ...formData,
         [e.target.name]: value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
         await login(formData.email, formData.password, formData.rester);
         router.push('/');
      } catch (err) {
         setError(err.message || 'Login failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="connexion-page">
         <div
            className="background-fixe"
            style={{ backgroundImage: 'url(/assets/background.jpg)' }}
         ></div>
         <Header />
         <div className="connexion-content">
            <div className="connexion-container">
               <div className='connexion-form'>
                  <form onSubmit={handleSubmit}>
                     <h1>{t('connexion_title')}</h1>
                     {error && <div className="error-message">{error}</div>}
                     <input
                        type="email"
                        name="email"
                        className='text-input'
                        placeholder={t('connexion_email_placeholder')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                     />
                     <input
                        type="password"
                        name="password"
                        className='text-input'
                        placeholder={t('connexion_password_placeholder')}
                        value={formData.password}
                        onChange={handleChange}
                        required
                     />
                     <div className="rester-container">
                        <input
                           type="checkbox"
                           name="rester"
                           id="rester"
                           className='rester'
                           checked={formData.rester}
                           onChange={handleChange}
                        />
                        <label htmlFor="rester" className="rester-label">
                           {t('connexion_rester_label')}
                        </label>
                     </div>
                     <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : t('connexion_button')}
                     </button>
                     <a className='inscrire' href="/inscription">{t('connexion_signup_link')}</a>
                  </form>
               </div>
            </div>
         </div>
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

export default Connexion;
