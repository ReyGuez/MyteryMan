import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {findBestAvailableLanguage} from 'react-native-localize';
import en from './en.json';
import es from './es.json';
import it from './it.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  it: {
    translation: it,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: findBestAvailableLanguage(['en', 'es', 'it'])?.languageTag || 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
