import { useLanguage } from '../hooks/useLanguage'

export function LanguageSelector() {
  const { lang, switchLang } = useLanguage()

  return (
    <div className="flex items-center gap-0.5 text-xs font-semibold">
      <button
        onClick={() => lang !== 'en' && switchLang()}
        className={`px-2 py-1 rounded transition-colors ${lang === 'en' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-gray-700">|</span>
      <button
        onClick={() => lang !== 'pt' && switchLang()}
        className={`px-2 py-1 rounded transition-colors ${lang === 'pt' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        aria-label="Mudar para Português"
      >
        PT
      </button>
    </div>
  )
}
