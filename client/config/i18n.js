import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    locales: ['ru', 'en', 'ua'],
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
export function getLanguage() {
  const fromLocal = typeof window !== 'undefined' && localStorage.i18nextLng
  return (i18n.language !== '0' && i18n.language) || (fromLocal !== '0' && fromLocal) || 'en'
}
