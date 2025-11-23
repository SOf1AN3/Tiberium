import React, { useState } from 'react';
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

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError('');

          if (formData.password !== formData.confirmPassword) {
               setError('Passwords do not match');
               return;
          }

          try {
               console.log('Sending signup request with data:', {
                    ...formData,
                    password: '[REDACTED]',
                    confirmPassword: '[REDACTED]'
               });

               const data = await signup(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.confirmPassword
               );

               console.log('Signup successful:', data);

               if (data) {
                    window.location.href = '/contact';
               }
          } catch (err) {
               console.error('Signup error details:', {
                    message: err.message,
                    stack: err.stack
               });
               setError(err.message || 'An error occurred during signup');
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
                         <button type="submit">{t('inscription_button')}</button>
                         <a className='inscrire' href="/connexion">{t('inscription_login_link')}</a>
                    </form>
               </div>
          </div>
     );
};

export default Inscription; 0