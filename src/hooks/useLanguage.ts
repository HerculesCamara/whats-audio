import { useLocation, useNavigate } from 'react-router-dom'
import { translations, type Lang } from '../i18n/translations'

export function useLanguage() {
  const location = useLocation()
  const navigate = useNavigate()

  const lang: Lang = location.pathname.startsWith('/pt-br') ? 'pt' : 'en'
  const T = translations[lang]

  const switchLang = () => {
    if (lang === 'en') {
      const newPath = '/pt-br' + (location.pathname === '/' ? '' : location.pathname)
      navigate(newPath)
    } else {
      const newPath = location.pathname.replace(/^\/pt-br/, '') || '/'
      navigate(newPath)
    }
  }

  return { lang, T, switchLang }
}
