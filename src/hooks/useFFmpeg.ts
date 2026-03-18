import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export type OutputFormat = 'mp3' | 'wav' | 'm4a';

interface ConversionResult {
  url: string;
  filename: string;
}

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());

  const load = useCallback(async () => {
    if (loaded) return;

    setLoading(true);
    setError(null);

    try {
      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
      const ffmpeg = ffmpegRef.current;

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setLoaded(true);
    } catch {
      setError('Failed to load converter. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  const convert = useCallback(async (
    file: File,
    format: OutputFormat
  ): Promise<ConversionResult | null> => {
    if (!loaded) {
      await load();
    }

    setProgress(0);
    setError(null);

    const ffmpeg = ffmpegRef.current;
    const inputName = 'input.ogg';
    const outputName = `output.${format}`;

    const formatCommands: Record<OutputFormat, string[]> = {
      mp3: ['-i', inputName, '-acodec', 'libmp3lame', '-q:a', '2', outputName],
      wav: ['-i', inputName, outputName],
      m4a: ['-i', inputName, '-acodec', 'aac', '-b:a', '128k', outputName],
    };

    const mimeTypes: Record<OutputFormat, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
    };

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(formatCommands[format]);
      const data = await ffmpeg.readFile(outputName);

      const blob = new Blob([(data as Uint8Array).slice()], { type: mimeTypes[format] });
      const url = URL.createObjectURL(blob);

      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const filename = `${originalName}.${format}`;

      return { url, filename };
    } catch {
      setError('Conversion failed. Please try again.');
      return null;
    }
  }, [loaded, load]);

  return {
    loaded,
    loading,
    progress,
    error,
    load,
    convert,
  };
}
