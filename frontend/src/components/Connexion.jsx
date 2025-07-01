import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../styles/connexion.css';

const Connexion = () => {
     const { t } = useTranslation();
     const { login } = useAuth();
     const [formData, setFormData] = useState({
          email: '',
          password: '',
          rester: false
     });
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     const validateForm = () => {
          if (!formData.email.trim()) {
               setError(t('connexion_error_email_required'));
               return false;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
               setError(t('connexion_error_invalid_email'));
               return false;
          }
          if (!formData.password.trim()) {
               setError(t('connexion_error_password_required'));
               return false;
          }
          return true;
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError('');

          if (!validateForm()) {
               return;
          }

          setIsLoading(true);
          try {
               const data = await login(formData.email, formData.password, formData.rester);
               if (data) {
                    window.location.href = '/';
               }
          } catch (error) {
               setError(error.message || t('connexion_error_login_failed'));
          } finally {
               setIsLoading(false);
          }
     };

     const handleChange = (e) => {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
          setFormData({
               ...formData,
               [e.target.name]: value
          });
     };

     return (
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
                              disabled={isLoading}
                              required
                         />
                         <input
                              type="password"
                              name="password"
                              className='text-input'
                              placeholder={t('connexion_password_placeholder')}
                              value={formData.password}
                              onChange={handleChange}
                              disabled={isLoading}
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
                                   disabled={isLoading}
                              />
                              <label htmlFor="rester" className="rester-label">
                                   {t('connexion_rester_label')}
                              </label>
                         </div>
                         <button type="submit" disabled={isLoading}>
                              {isLoading ? (
                                   <div className="loading-spinner"></div>
                              ) : (
                                   t('connexion_button')
                              )}
                         </button>
                         <a className='inscrire' href="/inscription">{t('connexion_signup_link')}</a>
                    </form>
               </div>
          </div>
     );
};

export default Connexion;