interface ProgressBarProps {
  progress: number;
  loading?: boolean;
}

export function ProgressBar({ progress, loading }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">
          {loading ? 'Loading converter (first time only)...' : `Converting... ${progress}%`}
        </span>
        <span className="text-whatsapp text-sm font-medium">{loading ? '' : `${progress}%`}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${loading ? 'bg-gray-500 animate-pulse w-full' : 'bg-whatsapp'}`}
          style={loading ? undefined : { width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
