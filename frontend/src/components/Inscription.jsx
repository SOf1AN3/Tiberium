import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../styles/connexion.css';

const Inscription = () => {
     const { t } = useTranslation();
     const { signup } = useAuth();
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
     });
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     const validateForm = () => {
          if (!formData.name.trim()) {
               setError(t('inscription_error_name_required'));
               return false;
          }
          if (!formData.email.trim()) {
               setError(t('inscription_error_email_required'));
               return false;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
               setError(t('inscription_error_invalid_email'));
               return false;
          }
          if (formData.password.length < 6) {
               setError(t('inscription_error_password_length'));
               return false;
          }
          if (formData.password !== formData.confirmPassword) {
               setError(t('inscription_error_passwords_not_match'));
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
               const data = await signup(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.confirmPassword
               );

               if (data) {
                    window.location.href = '/connexion';
               }
          } catch (err) {
               setError(err.message || t('inscription_error_signup_failed'));
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
                         <h1>{t('inscription_title')}</h1>
                         {error && <div className="error-message">{error}</div>}
                         <input
                              type="text"
                              name="name"
                              className='text-input'
                              placeholder={t('inscription_name_placeholder')}
                              value={formData.name}
                              onChange={handleChange}
                         />
                         <input
                              type="email"
                              name="email"
                              className='text-input'
                              placeholder={t('inscription_email_placeholder')}
                              value={formData.email}
                              onChange={handleChange}
                         />
                         <input
                              type="password"
                              name="password"
                              className='text-input'
                              placeholder={t('inscription_password_placeholder')}
                              value={formData.password}
                              onChange={handleChange}
                         />
                         <input
                              type="password"
                              name="confirmPassword"
                              className='text-input'
                              placeholder={t('inscription_confirm_password_placeholder')}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                         />
                         <div className="rester-container">
                              <input type="checkbox" name="rester" id="rester" className='rester' onChange={handleChange} />
                              <label htmlFor="rester" className="rester-label">{t('inscription_rester_label')}</label>
                         </div>
                         <button type="submit" disabled={isLoading}>
                              {isLoading ? (
                                   <div className="loading-spinner"></div>
                              ) : (
                                   t('inscription_button')
                              )}
                         </button>
                         <a className='inscrire' href="/connexion">{t('inscription_login_link')}</a>
                    </form>
               </div>
          </div>
     );
};

export default Inscription; 0