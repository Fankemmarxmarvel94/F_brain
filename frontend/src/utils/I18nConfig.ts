import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import Backend from 'i18next-http-backend';
import postProcessor from 'i18next-sprintf-postprocessor';
import enTranslation from "./i18n/locales/en/translation.json";
import frTranslation from "./i18n/locales/fr/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  }
};

i18n
  .use(Backend)
  .use(postProcessor)
  .use(ChainedBackend)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init(
    {
      lng: 'en',
      resources,
      debug: false,
      fallbackLng: 'en',
      saveMissing: false,
      returnObjects: false,
      interpolation: {
        escapeValue: false,
      },
      initImmediate: false,
    },
  );


export default i18n;