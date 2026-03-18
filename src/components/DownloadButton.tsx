interface DownloadButtonProps {
  url: string;
  filename: string;
  onReset: () => void;
}

export function DownloadButton({ url, filename, onReset }: DownloadButtonProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-whatsapp">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Done! Your file is ready.</span>
      </div>

      <a
        href={url}
        download={filename}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold rounded-xl transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download {filename}
      </a>

      <button
        onClick={onReset}
        className="text-gray-400 hover:text-white text-sm transition-colors duration-200 underline underline-offset-2"
      >
        Convert another file
      </button>
    </div>
  );
}
