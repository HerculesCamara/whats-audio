import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileUpload } from './components/FileUpload';
import { FormatSelector } from './components/FormatSelector';
import { ProgressBar } from './components/ProgressBar';
import { DownloadButton } from './components/DownloadButton';
import { LanguageSelector } from './components/LanguageSelector';
import { useFFmpeg, type OutputFormat } from './hooks/useFFmpeg';
import { useLanguage } from './hooks/useLanguage';
import { BASE_URL } from './i18n/translations';

type AppState = 'idle' | 'ready' | 'converting' | 'done' | 'error';

const isSupported = typeof SharedArrayBuffer !== 'undefined';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>('mp3');
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { loading, progress, error, convert } = useFFmpeg();
  const { lang, T } = useLanguage();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setAppState('ready');
    setResult(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;
    setAppState('converting');
    const output = await convert(selectedFile, format);
    if (output) {
      setResult(output);
      setAppState('done');
    } else {
      setAppState('error');
    }
  }, [selectedFile, format, convert]);

  const handleReset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setSelectedFile(null);
    setResult(null);
    setAppState('idle');
  }, [result]);

  const enUrl = `${BASE_URL}/`;
  const ptUrl = `${BASE_URL}/pt-br`;
  const canonicalUrl = lang === 'pt' ? ptUrl : enUrl;

  return (
    <>
      <Helmet>
        <html lang={lang === 'pt' ? 'pt-BR' : 'en'} />
        <title>{T.meta.homeTitle}</title>
        <meta name="description" content={T.meta.homeDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="pt-BR" href={ptUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content={T.meta.homeTitle} />
        <meta property="og:description" content={T.meta.homeDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={lang === 'pt' ? 'pt_BR' : 'en_US'} />
      </Helmet>

      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        {/* Header */}
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
            <h1 className="text-3xl font-bold tracking-tight">WhatsAudio</h1>
          </div>
          <p className="text-gray-400 text-sm">{T.header.tagline}</p>
        </header>

        {/* Main content */}
        <main className="flex-1">
          {/* Converter */}
          <section className="flex items-center justify-center p-4 py-12" aria-label="WhatsApp audio converter">
            {!isSupported ? (
              <div className="max-w-md w-full bg-red-900/30 border border-red-700 rounded-2xl p-6 text-center">
                <p className="text-red-400">{T.ui.browserError}</p>
              </div>
            ) : (
              <div className="max-w-md w-full">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 rounded-xl">
                    <span className="text-base">🔒</span>
                    <span className="text-gray-300 text-sm">{T.privacy.badge}</span>
                  </div>

                  {appState !== 'done' && (
                    <FileUpload onFileSelect={handleFileSelect} disabled={appState === 'converting' || loading} />
                  )}

                  {selectedFile && appState !== 'done' && (
                    <div className="flex items-center gap-3 py-2 px-4 bg-gray-800 rounded-xl">
                      <svg className="w-4 h-4 text-whatsapp flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                      </svg>
                      <span className="text-gray-300 text-sm truncate">{selectedFile.name}</span>
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  )}

                  {(appState === 'ready' || appState === 'converting') && (
                    <FormatSelector value={format} onChange={setFormat} disabled={appState === 'converting' || loading} />
                  )}

                  {(appState === 'converting' || loading) && (
                    <ProgressBar progress={progress} loading={loading} />
                  )}

                  {appState === 'ready' && (
                    <button
                      onClick={handleConvert}
                      disabled={loading}
                      className="w-full py-3 px-6 bg-whatsapp hover:bg-whatsapp-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
                    >
                      {T.ui.convertBtn}
                    </button>
                  )}

                  {(appState === 'error' || error) && (
                    <div className="space-y-3">
                      <p className="text-red-400 text-sm text-center">
                        {error || T.ui.genericError}
                      </p>
                      <button
                        onClick={handleReset}
                        className="w-full py-2 px-4 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl transition-colors duration-200 text-sm"
                      >
                        {T.ui.tryAgain}
                      </button>
                    </div>
                  )}

                  {appState === 'done' && result && (
                    <DownloadButton url={result.url} filename={result.filename} onReset={handleReset} />
                  )}
                </div>

                <p className="text-center text-gray-600 text-xs mt-4">{T.privacy.note}</p>
              </div>
            )}
          </section>

          {/* How It Works */}
          <section className="max-w-2xl mx-auto px-4 pb-16" aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-xl font-semibold text-center text-white mb-8">
              {T.howSection.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {T.howSection.steps.map(({ title, desc }, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
                  <div className="w-8 h-8 rounded-full bg-whatsapp text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-2xl mx-auto px-4 pb-20" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-semibold text-center text-white mb-8">
              {T.faq.title}
            </h2>
            <div className="space-y-3">
              {T.faq.items.map((item, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:bg-gray-800 transition-colors duration-150"
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span>{item.q}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    className={`px-5 pb-4 text-gray-400 text-sm leading-relaxed ${openFaq === i ? '' : 'hidden'}`}
                  >
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-4 px-4 text-center border-t border-gray-800 space-y-1">
          <p className="text-gray-600 text-sm">{T.footer.made}</p>
          <Link
            to={lang === 'pt' ? '/pt-br/how-it-works' : '/how-it-works'}
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            {T.footer.howItWorks}
          </Link>
        </footer>
      </div>
    </>
  );
}
