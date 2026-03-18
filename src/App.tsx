import { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { FormatSelector } from './components/FormatSelector';
import { ProgressBar } from './components/ProgressBar';
import { DownloadButton } from './components/DownloadButton';
import { useFFmpeg, type OutputFormat } from './hooks/useFFmpeg';

type AppState = 'idle' | 'ready' | 'converting' | 'done' | 'error';

const isSupported = typeof SharedArrayBuffer !== 'undefined';

const faqItems = [
  {
    q: 'How do I convert a WhatsApp voice message to MP3?',
    a: 'Upload your .ogg or .opus file from WhatsApp, select MP3 as the output format, and click Convert. The file will be ready to download in seconds — entirely in your browser, no server involved.',
  },
  {
    q: 'Is WhatsAudio free?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees.',
  },
  {
    q: 'Are my files safe? Does WhatsAudio upload anything?',
    a: 'Your files never leave your device. All conversion runs locally in your browser using WebAssembly (FFmpeg). Nothing is sent to any server.',
  },
  {
    q: 'What formats are supported?',
    a: 'Input: .ogg and .opus (the format WhatsApp uses for voice messages). Output: MP3, WAV, or M4A — pick whatever works best for your use case.',
  },
  {
    q: "Why can't I play WhatsApp voice messages on my computer?",
    a: 'WhatsApp saves voice messages as .ogg files using the Opus codec. Most media players don\'t support it natively. Converting to MP3 or WAV makes them compatible with any player.',
  },
  {
    q: 'Does WhatsAudio work on mobile?',
    a: 'Yes, WhatsAudio works on any modern browser, including Chrome and Safari on Android and iOS.',
  },
  {
    q: 'Como converter mensagem de voz do WhatsApp para MP3?',
    a: 'Acesse o WhatsAudio, faça upload do arquivo .ogg ou .opus do WhatsApp, escolha o formato MP3 e clique em Converter. O arquivo estará pronto para baixar em segundos, sem enviar nada para nenhum servidor.',
  },
  {
    q: 'O WhatsAudio é gratuito?',
    a: 'Sim, totalmente gratuito. Sem cadastro, sem assinatura, sem taxas ocultas.',
  },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>('mp3');
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { loading, progress, error, convert } = useFFmpeg();

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

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="py-8 px-4 text-center border-b border-gray-800" role="banner">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-whatsapp flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsAudio</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Convert WhatsApp voice messages to MP3 — 100% in your browser
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Converter */}
        <section className="flex items-center justify-center p-4 py-12" aria-label="WhatsApp audio converter">
        {!isSupported ? (
          <div className="max-w-md w-full bg-red-900/30 border border-red-700 rounded-2xl p-6 text-center">
            <p className="text-red-400">
              Your browser doesn't support this feature. Please use Chrome, Firefox, or Safari.
            </p>
          </div>
        ) : (
          <div className="max-w-md w-full">
            {/* Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">

              {/* Privacy badge */}
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 rounded-xl">
                <span className="text-base">🔒</span>
                <span className="text-gray-300 text-sm">Your files never leave your device</span>
              </div>

              {/* File upload — show unless done */}
              {appState !== 'done' && (
                <FileUpload
                  onFileSelect={handleFileSelect}
                  disabled={appState === 'converting' || loading}
                />
              )}

              {/* Selected file info */}
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

              {/* Format selector */}
              {(appState === 'ready' || appState === 'converting') && (
                <FormatSelector
                  value={format}
                  onChange={setFormat}
                  disabled={appState === 'converting' || loading}
                />
              )}

              {/* Progress */}
              {(appState === 'converting' || loading) && (
                <ProgressBar progress={progress} loading={loading} />
              )}

              {/* Convert button */}
              {appState === 'ready' && (
                <button
                  onClick={handleConvert}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-whatsapp hover:bg-whatsapp-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
                >
                  Convert
                </button>
              )}

              {/* Error */}
              {(appState === 'error' || error) && (
                <div className="space-y-3">
                  <p className="text-red-400 text-sm text-center">
                    {error || 'Something went wrong. Please try again.'}
                  </p>
                  <button
                    onClick={handleReset}
                    className="w-full py-2 px-4 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl transition-colors duration-200 text-sm"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Download */}
              {appState === 'done' && result && (
                <DownloadButton
                  url={result.url}
                  filename={result.filename}
                  onReset={handleReset}
                />
              )}
            </div>

            {/* Privacy note */}
            <p className="text-center text-gray-600 text-xs mt-4">
              All processing happens in your browser. We don't upload or store any data.
            </p>
          </div>
        )}
        </section>

        {/* How It Works */}
        <section className="max-w-2xl mx-auto px-4 pb-16" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-xl font-semibold text-center text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Upload your file',
                description: 'Select or drag a .ogg or .opus file exported from WhatsApp.',
              },
              {
                step: '2',
                title: 'Choose a format',
                description: 'Pick MP3, WAV, or M4A depending on where you want to play the audio.',
              },
              {
                step: '3',
                title: 'Download',
                description: 'Click Convert and download instantly. No waiting, no email, no account.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
                <div className="w-8 h-8 rounded-full bg-whatsapp text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-4 pb-20" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-semibold text-center text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
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
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
      <footer className="py-4 px-4 text-center border-t border-gray-800">
        <p className="text-gray-600 text-sm">Made with ❤️ · WhatsAudio</p>
      </footer>
    </div>
  );
}
