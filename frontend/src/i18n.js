import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';

// Configuration de i18next avec détection automatique de la langue
i18n
   .use(LanguageDetector) // Utiliser le détecteur de langue
   .use(initReactI18next) // Utiliser i18next avec React
   .init({
      resources: {
         fr: { translation: translationFR },
         en: { translation: translationEN },
      },
      fallbackLng: 'ar', // Langue par défaut si la langue détectée n'est pas disponible
      detection: {
         // Méthodes de détection de la langue
         order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
         // Stocker la langue détectée pour les prochaines visites
         caches: ['cookie', 'localStorage'],
      },
      interpolation: {
         escapeValue: false, // React s'occupe déjà d'échapper les valeurs
      },
   });

export default i18n;
