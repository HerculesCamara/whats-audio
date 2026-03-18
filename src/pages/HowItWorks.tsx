import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { LanguageSelector } from '../components/LanguageSelector'
import { useLanguage } from '../hooks/useLanguage'
import { BASE_URL } from '../i18n/translations'

export default function HowItWorks() {
  const { lang, T } = useLanguage()
  const h = T.howPage

  const enUrl = `${BASE_URL}/how-it-works`
  const ptUrl = `${BASE_URL}/pt-br/how-it-works`
  const canonicalUrl = lang === 'pt' ? ptUrl : enUrl

  return (
    <>
      <Helmet>
        <html lang={lang === 'pt' ? 'pt-BR' : 'en'} />
        <title>{T.meta.howTitle}</title>
        <meta name="description" content={T.meta.howDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="pt-BR" href={ptUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content={T.meta.howTitle} />
        <meta property="og:description" content={T.meta.howDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: T.meta.howTitle,
          description: T.meta.howDesc,
          url: canonicalUrl,
          author: { '@type': 'Person', name: 'Hercules Camara', url: 'https://herculescamara.com' },
          publisher: { '@type': 'Organization', name: 'WhatsAudio', url: BASE_URL },
          inLanguage: lang === 'pt' ? 'pt-BR' : 'en',
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <header className="relative py-8 px-4 text-center border-b border-gray-800">
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <LanguageSelector />
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-whatsapp flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <Link to={lang === 'pt' ? '/pt-br' : '/'} className="text-3xl font-bold tracking-tight hover:text-whatsapp transition-colors">
              WhatsAudio
            </Link>
          </div>
          <p className="text-gray-400 text-sm">{T.header.tagline}</p>
        </header>

        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
          <h1 className="text-3xl font-bold text-white mb-3">{h.title}</h1>
          <p className="text-gray-400 mb-12 leading-relaxed">{h.intro}</p>

          {/* The Problem */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">{h.problem.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-4">{h.problem.p1}</p>
            <p className="text-gray-400 leading-relaxed">{h.problem.p2}</p>
          </section>

          {/* The Technology */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">{h.tech.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-4">{h.tech.p1}</p>
            <p className="text-gray-400 leading-relaxed mb-4">{h.tech.p2}</p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">{h.tech.codeLabel}</p>
              <code className="text-sm text-whatsapp font-mono block">
                ffmpeg -i input.ogg -acodec libmp3lame -q:a 2 output.mp3
              </code>
            </div>
          </section>

          {/* Step by Step */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">{h.steps.title}</h2>
            <div className="space-y-4">
              {h.steps.items.map(({ title, body }, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-whatsapp text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">{h.privacy.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-4">{h.privacy.p1}</p>
            <p className="text-gray-400 leading-relaxed">{h.privacy.p2}</p>
          </section>

          {/* Browser Requirements */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">{h.browser.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-4">{h.browser.p1}</p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">{h.browser.colBrowser}</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">{h.browser.colVersion}</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">{h.browser.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { browser: 'Chrome / Edge', version: '92+' },
                    { browser: 'Firefox', version: '79+' },
                    { browser: 'Safari', version: '15.2+' },
                    { browser: 'Chrome for Android', version: '92+' },
                    { browser: 'Safari iOS', version: '15.2+' },
                  ].map(({ browser, version }) => (
                    <tr key={browser}>
                      <td className="px-5 py-3 text-gray-300">{browser}</td>
                      <td className="px-5 py-3 text-gray-400">{version}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-whatsapp/20 text-whatsapp">
                          {h.browser.supported}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link
              to={lang === 'pt' ? '/pt-br' : '/'}
              className="inline-flex items-center gap-2 py-3 px-8 bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold rounded-xl transition-colors duration-200"
            >
              {h.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </main>

        <footer className="py-4 px-4 text-center border-t border-gray-800">
          <p className="text-gray-600 text-sm">{T.footer.made}</p>
        </footer>
      </div>
    </>
  )
}
