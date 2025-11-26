import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'next-i18next';
import Header from './Header';

const ProfileSettings = () => {
   const { t, i18n } = useTranslation('translation');
   const router = useRouter();
   const { user, getToken } = useAuth();

   const [emailForm, setEmailForm] = useState({
      newEmail: '',
      password: ''
   });

   const [passwordForm, setPasswordForm] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
   });

   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const handleEmailChange = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (!user) {
         setError(t('profile_settings_login_required'));
         return;
      }

      if (!emailForm.newEmail || !emailForm.password) {
         setError(t('profile_settings_all_fields_required'));
         return;
      }

      try {
         const response = await fetch('/api/auth/change-email', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(emailForm)
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error);
         }

         setSuccess(t('profile_settings_email_updated'));
         setEmailForm({ newEmail: '', password: '' });
      } catch (error) {
         setError(error.message);
      }
   };

   const handlePasswordChange = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (!user) {
         setError(t('profile_settings_login_required'));
         return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
         setError(t('profile_settings_passwords_not_match'));
         return;
      }

      try {
         const response = await fetch('/api/auth/change-password', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
               currentPassword: passwordForm.currentPassword,
               newPassword: passwordForm.newPassword
            })
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error);
         }

         setSuccess(t('profile_settings_password_updated'));
         setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
         });
      } catch (error) {
         setError(error.message);
      }
   };

   const changeLanguage = (lang) => {
      router.push(router.pathname, router.asPath, { locale: lang });
   };

   const languageOptions = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' }
   ];

   return (
      <>
         <Header />
         <div className="container">
            <div className="card">
               <div className="card-header">
                  <div className="flex justify-between items-center">
                     <h2 className="card-title">{t('profile_settings_title')}</h2>
                     <div className="flex items-center space-x-4">
                        <select className="select" value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
                           {languageOptions.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                 {lang.name}
                              </option>
                           ))}
                        </select>
                        <button className="button button-outline" onClick={() => router.push('/')}>
                           {t('header_home')}
                        </button>
                     </div>
                  </div>
               </div>
               <div className="card-content">
                  {error && (
                     <div className="alert alert-destructive">
                        <div className="alert-title">Error</div>
                        <div>{error}</div>
                     </div>
                  )}
                  {success && (
                     <div className="alert alert-success">
                        <div className="alert-title">Success</div>
                        <div>{success}</div>
                     </div>
                  )}
                  {user ? (
                     <div className="space-y-4">
                        <div className="card">
                           <div className="card-header">
                              <h2 className="card-title">{t('profile_settings_change_email')}</h2>
                           </div>
                           <div className="card-content">
                              <form onSubmit={handleEmailChange} className="space-y-4">
                                 <input
                                    className="input"
                                    type="email"
                                    value={emailForm.newEmail}
                                    onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                                    placeholder={t('profile_settings_new_email')}
                                 />
                                 <input
                                    className="input"
                                    type="password"
                                    value={emailForm.password}
                                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                                    placeholder={t('profile_settings_confirm_password')}
                                 />
                                 <button className="button" type="submit">{t('profile_settings_update_email')}</button>
                              </form>
                           </div>
                        </div>
                        <div className="card">
                           <div className="card-header">
                              <h2 className="card-title">{t('profile_settings_change_password')}</h2>
                           </div>
                           <div className="card-content">
                              <form onSubmit={handlePasswordChange} className="space-y-4">
                                 <input
                                    className="input"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    placeholder={t('profile_settings_current_password')}
                                 />
                                 <input
                                    className="input"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    placeholder={t('profile_settings_new_password')}
                                 />
                                 <input
                                    className="input"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    placeholder={t('profile_settings_confirm_new_password')}
                                 />
                                 <button className="button" type="submit">{t('profile_settings_update_password')}</button>
                              </form>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="alert">
                        <div className="alert-title">Not logged in</div>
                        <div>{t('profile_settings_login_required')}</div>
                     </div>
                  )}
                  {user && user.type === 'admin' && (
                     <div className="card">
                        <div className="card-content">
                           <button className="button button-outline" onClick={() => router.push('/admin/users')}>
                              (ADMIN) Users management list
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default ProfileSettings;
