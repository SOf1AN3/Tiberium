import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Inscription = () => {
   const { t } = useTranslation();
   const { signup } = useAuth();
   const router = useRouter();
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
   });
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      if (formData.password !== formData.confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      setLoading(true);

      try {
         await signup(formData.name, formData.email, formData.password, formData.confirmPassword);
         alert('Registration successful! Please login.');
         router.push('/connexion');
      } catch (err) {
         setError(err.message || 'Registration failed');
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
                     <h1>{t('inscription_title')}</h1>
                     {error && <div className="error-message">{error}</div>}
                     <input
                        type="text"
                        name="name"
                        className='text-input'
                        placeholder={t('inscription_name_placeholder')}
                        value={formData.name}
                        onChange={handleChange}
                        required
                     />
                     <input
                        type="email"
                        name="email"
                        className='text-input'
                        placeholder={t('inscription_email_placeholder')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                     />
                     <input
                        type="password"
                        name="password"
                        className='text-input'
                        placeholder={t('inscription_password_placeholder')}
                        value={formData.password}
                        onChange={handleChange}
                        required
                     />
                     <input
                        type="password"
                        name="confirmPassword"
                        className='text-input'
                        placeholder={t('inscription_confirm_password_placeholder')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                     />
                     <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : t('inscription_button')}
                     </button>
                     <a className='inscrire' href="/connexion">{t('inscription_login_link')}</a>
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

export default Inscription;
