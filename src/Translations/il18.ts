import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import {findBestAvailableLanguage} from 'react-native-localize';
import es from './es.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: findBestAvailableLanguage(['en', 'es'])?.languageTag || 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
