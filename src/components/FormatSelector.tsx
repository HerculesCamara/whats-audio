import { useLanguage } from '../hooks/useLanguage';
import type { OutputFormat } from '../hooks/useFFmpeg';

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  const { T } = useLanguage();

  const formats: { value: OutputFormat; label: string; description: string }[] = [
    { value: 'mp3', label: 'MP3', description: T.format.mp3Desc },
    { value: 'wav', label: 'WAV', description: T.format.wavDesc },
    { value: 'm4a', label: 'M4A', description: T.format.m4aDesc },
  ];

  return (
    <div className="w-full">
      <p className="text-gray-400 text-sm mb-3">{T.format.label}</p>
      <div className="grid grid-cols-3 gap-3">
        {formats.map((fmt) => (
          <button
            key={fmt.value}
            onClick={() => onChange(fmt.value)}
            disabled={disabled}
            className={`
              py-3 px-4 rounded-xl border-2 transition-all duration-200 text-center
              ${value === fmt.value
                ? 'border-whatsapp bg-whatsapp/10 text-whatsapp'
                : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="font-semibold text-lg">{fmt.label}</div>
            <div className="text-xs opacity-70 mt-0.5">{fmt.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
