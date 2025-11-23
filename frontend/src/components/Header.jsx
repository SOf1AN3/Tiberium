import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import menuIcon from '../assets/menu.png';
import exitIcon from '../assets/exit.png';
import settings from '../assets/settings.png';
import '../App.css';

const Header = () => {
     const { t } = useTranslation();
     const [isMenuOpen, setMenuOpen] = useState(false);
     const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
     const [isFadingOut, setIsFadingOut] = useState(false);
     const { user, logout } = useAuth();
     const navigate = useNavigate();

     const toggleMenu = () => {
          setMenuOpen(!isMenuOpen);
     };

     const handleAuthClick = () => {
          if (user) {
               setShowLogoutConfirm(true);
          } else {
               navigate('/connexion');
          }
     };

     const handleSettingsClick = () => { navigate('/settings'); };

     const confirmLogout = async () => {
          try {
               await logout();
               navigate('/home');
          } catch (error) {
               console.error('Erreur lors de la déconnexion:', error);
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
          const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
          i18n.changeLanguage(newLanguage);
     };

     return (
          <div className='no-select'>
               <header className={isMenuOpen ? 'show-menu menu-open' : ''}>
                    <a draggable="false" href="/home">
                         <h5 className='logo-text'>Tiberium</h5>
                    </a>
                    <ul className="header-list">
                         <li><a draggable="false" href="/home">{t('header_home')}</a></li>
                         <li><a draggable="false" href="/services">{t('header_services')}</a></li>
                         <li><a draggable="false" href="/expats">{t('header_expats')}</a></li>
                         <li><a draggable="false" href="/contact">{t('header_contact')}</a></li>
                         <li><a draggable="false" href="/about">{t('header_about')}</a></li>
                         <li><a draggable="false" href="/chat">{t('header_chat')}</a></li>
                    </ul>

                    <button className="menu-button" onClick={toggleMenu}>
                         <img draggable="false" src={menuIcon} alt="Menu" />
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
                              <img draggable="false" src={exitIcon} alt="Exit" />
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