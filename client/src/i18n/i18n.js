import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';

i18n
  .use(LanguageDetector)       // auto-detect browser language
  .use(initReactI18next)       // bind to React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn },
    },
    fallbackLng: 'en',          // fall back to English if key missing
    supportedLngs: ['en', 'hi', 'kn'],
    interpolation: {
      escapeValue: false,       // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],  // persist chosen language across sessions
    },
  });

export default i18n;
