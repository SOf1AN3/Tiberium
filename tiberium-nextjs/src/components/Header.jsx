import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'next-i18next';

const Header = () => {
   const { t, i18n } = useTranslation();
   const [isMenuOpen, setMenuOpen] = useState(false);
   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
   const [isFadingOut, setIsFadingOut] = useState(false);
   const { user, logout } = useAuth();
   const router = useRouter();

   const toggleMenu = () => {
      setMenuOpen(!isMenuOpen);
   };

   const handleAuthClick = () => {
      if (user) {
         setShowLogoutConfirm(true);
      } else {
         router.push('/connexion');
      }
   };

   const handleSettingsClick = () => { router.push('/profile'); };

   const confirmLogout = async () => {
      try {
         await logout();
         router.push('/');
      } catch (error) {
         console.error('Logout error:', error);
      } finally {
         setShowLogoutConfirm(false);
      }
   };

   const cancelLogout = () => {
      setIsFadingOut(true);
      setTimeout(() => {
         setShowLogoutConfirm(false);
         setIsFadingOut(false);
      }, 300);
   };

   const changeLanguage = () => {
      const newLocale = i18n.language === 'en' ? 'fr' : 'en';
      router.push(router.pathname, router.asPath, { locale: newLocale });
   };

   return (
      <div className='no-select'>
         <header className={isMenuOpen ? 'show-menu menu-open' : ''}>
            <Link href="/" draggable={false}>
               <h5 className='logo-text'>Tiberium</h5>
            </Link>
            <ul className="header-list">
               <li><Link href="/" draggable={false}>{t('header_home')}</Link></li>
               <li><Link href="/services" draggable={false}>{t('header_services')}</Link></li>
               <li><Link href="/expats" draggable={false}>{t('header_expats')}</Link></li>
               <li><Link href="/contact" draggable={false}>{t('header_contact')}</Link></li>
               <li><Link href="/about" draggable={false}>{t('header_about')}</Link></li>
               {user && <li><Link href="/chat" draggable={false}>{t('header_chat')}</Link></li>}
            </ul>

            <button className="menu-button" onClick={toggleMenu}>
               <img draggable={false} src="/assets/menu.png" alt="Menu" />
            </button>

            <div className='header-right-section'>
               <button className='connexion-btn btn' onClick={handleSettingsClick}>{t('header_settings')}</button>
               <button
                  className='connexion-btn btn'
                  onClick={handleAuthClick}
               >
                  {user ? t('header_logout') : t('header_login')}
               </button>
            </div>

            {isMenuOpen && (
               <button className="exit-button" onClick={toggleMenu}>
                  <img draggable={false} src="/assets/exit.png" alt="Exit" />
               </button>
            )}

            {showLogoutConfirm && (
               <div className="logout-confirm-overlay">
                  <div className={`logout-confirm-popup ${isFadingOut ? 'fade-out' : ''}`}>
                     <p>{t('logout_confirm_message')}</p>
                     <button className="confirm-btn" onClick={confirmLogout}>
                        {t('logout_confirm_yes')}
                     </button>
                     <button className="cancel-btn" onClick={cancelLogout}>
                        {t('logout_confirm_no')}
                     </button>
                  </div>
               </div>
            )}
         </header>
      </div>
   );
};

export default Header;
