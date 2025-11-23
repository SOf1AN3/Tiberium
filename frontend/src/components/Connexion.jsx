import React, { useState } from 'react';
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

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError('');

          try {
               const data = await login(formData.email, formData.password, formData.rester);
               console.log('Login successful:', data);
               window.location.href = '/';
          } catch (error) {
               console.error('Login error:', error);
               setError(error.message || 'Login failed');
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
                         <button type="submit">{t('connexion_button')}</button>
                         <a className='inscrire' href="/inscription">{t('connexion_signup_link')}</a>
                    </form>
               </div>
          </div>
     );
};

export default Connexion;