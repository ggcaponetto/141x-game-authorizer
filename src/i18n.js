import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUs from "./languages/en-US.json";
i18n
  .use(initReactI18next)
  .init({
    lng: 'en-US',
    debug: true,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      'en-US': enUs,
    },
  });
export default i18n;
