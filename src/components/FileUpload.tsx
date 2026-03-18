import { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const VALID_FORMATS = ['.ogg', '.opus'];

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndSelect = useCallback((file: File) => {
    setValidationError(null);

    if (file.size > MAX_SIZE) {
      setValidationError('File is too large. Please use files under 50MB.');
      return;
    }

    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!VALID_FORMATS.includes(extension)) {
      setValidationError('Please select a valid audio file (.ogg, .opus)');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  }, [disabled, validateAndSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    e.target.value = '';
  }, [validateAndSelect]);

  return (
    <div className="w-full">
      <label
        className={`
          flex flex-col items-center justify-center w-full h-48
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
          ${dragOver
            ? 'border-whatsapp bg-green-50 scale-[1.01]'
            : 'border-gray-600 bg-gray-800/50 hover:border-whatsapp hover:bg-gray-800'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
          <div className={`p-4 rounded-full transition-colors ${dragOver ? 'bg-green-100' : 'bg-gray-700'}`}>
            <svg className={`w-8 h-8 ${dragOver ? 'text-whatsapp' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Drop your audio file here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
            <p className="text-gray-500 text-xs mt-2">Accepts .ogg, .opus files</p>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".ogg,.opus,audio/ogg,audio/opus"
          onChange={handleChange}
          disabled={disabled}
        />
      </label>

      {validationError && (
        <p className="mt-3 text-red-400 text-sm text-center">{validationError}</p>
      )}
    </div>
  );
}
