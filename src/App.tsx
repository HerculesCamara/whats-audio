import { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { FormatSelector } from './components/FormatSelector';
import { ProgressBar } from './components/ProgressBar';
import { DownloadButton } from './components/DownloadButton';
import { useFFmpeg, type OutputFormat } from './hooks/useFFmpeg';

type AppState = 'idle' | 'ready' | 'converting' | 'done' | 'error';

const isSupported = typeof SharedArrayBuffer !== 'undefined';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>('mp3');
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);

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
      <header className="py-8 px-4 text-center border-b border-gray-800">
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
      <main className="flex-1 flex items-center justify-center p-4">
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
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center border-t border-gray-800">
        <p className="text-gray-600 text-sm">Made with ❤️ · WhatsAudio</p>
      </footer>
    </div>
  );
}
