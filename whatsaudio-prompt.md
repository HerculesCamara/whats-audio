# Prompt para Claude Code: WhatsAudio

## Contexto do Projeto

Criar um **MVP** de um site chamado **WhatsAudio** que converte arquivos de áudio do WhatsApp (formato `.ogg` com codec Opus) para outros formatos como MP3, WAV e M4A. A conversão deve acontecer **100% no navegador do usuário** usando `ffmpeg.wasm`, sem enviar arquivos para nenhum servidor.

**Nome do projeto:** `whatsaudio`

**Tagline:** *"Convert WhatsApp voice messages to MP3 — 100% in your browser, no upload needed"*

**Idioma da interface:** Inglês

---

## Stack Técnica (OBRIGATÓRIA)

- **Vite** como bundler e dev server (necessário para configurar headers COOP/COEP)
- **React** com TypeScript
- **@ffmpeg/ffmpeg** versão `0.12.x` (API nova - NÃO usar `createFFmpeg`, usar `new FFmpeg()`)
- **@ffmpeg/util** para utilitários como `toBlobURL` e `fetchFile`
- **@ffmpeg/core** versão `0.12.10` (carregar via CDN jsdelivr)
- **Tailwind CSS** para estilização rápida

---

## Configuração Crítica: Headers de Segurança

O ffmpeg.wasm usa `SharedArrayBuffer`, que só funciona em contextos cross-origin isolated. O `vite.config.ts` DEVE incluir:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
})
```

---

## API do ffmpeg.wasm (versão 0.12.x)

A API correta para esta versão é:

```typescript
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

// Instanciar
const ffmpeg = new FFmpeg();

// Carregar o core via CDN (usar ESM para Vite)
const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

await ffmpeg.load({
  coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
  wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
});

// Eventos disponíveis
ffmpeg.on('log', ({ message }) => console.log(message));
ffmpeg.on('progress', ({ progress }) => console.log(`${progress * 100}%`));

// Escrever arquivo no filesystem virtual
await ffmpeg.writeFile('input.ogg', await fetchFile(file));

// Executar comando
await ffmpeg.exec(['-i', 'input.ogg', '-acodec', 'libmp3lame', '-q:a', '2', 'output.mp3']);

// Ler arquivo de saída
const data = await ffmpeg.readFile('output.mp3');

// Criar URL para download
const blob = new Blob([data], { type: 'audio/mpeg' });
const url = URL.createObjectURL(blob);
```

---

## Comandos FFmpeg para Conversão

### OGG (Opus) → MP3
```
-i input.ogg -acodec libmp3lame -q:a 2 output.mp3
```

### OGG (Opus) → WAV
```
-i input.ogg output.wav
```

### OGG (Opus) → M4A (AAC)
```
-i input.ogg -acodec aac -b:a 128k output.m4a
```

---

## Fluxo do Usuário (MVP)

1. Usuário acessa o site
2. Vê uma área de drag-and-drop ou botão para selecionar arquivo
3. Seleciona um arquivo `.ogg` do WhatsApp
4. Escolhe o formato de saída (MP3, WAV, M4A) via dropdown ou botões
5. Clica em "Convert"
6. Vê uma barra de progresso durante a conversão
7. Recebe um botão para baixar o arquivo convertido

---

## Estrutura de Arquivos Sugerida

```
whatsaudio/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── FormatSelector.tsx
│   │   ├── ProgressBar.tsx
│   │   └── DownloadButton.tsx
│   ├── hooks/
│   │   └── useFFmpeg.ts
│   └── utils/
│       └── ffmpegCommands.ts
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── ROADMAP.md
```

---

## Textos da Interface (Inglês)

### Header
- **Título:** "WhatsAudio"
- **Tagline:** "Convert WhatsApp voice messages to MP3 — 100% in your browser"

### Upload Area
- **Título:** "Drop your audio file here"
- **Subtítulo:** "or click to browse"
- **Formatos aceitos:** "Accepts .ogg, .opus files"

### Format Selector
- **Label:** "Convert to:"
- **Opções:** "MP3", "WAV", "M4A"

### Botões
- **Converter:** "Convert"
- **Download:** "Download"
- **Novo arquivo:** "Convert another file"

### Estados
- **Carregando FFmpeg:** "Loading converter (first time only)..."
- **Convertendo:** "Converting... {progress}%"
- **Concluído:** "Done! Your file is ready."
- **Erro:** "Something went wrong. Please try again."

### Privacy Badge
- **Texto:** "🔒 Your files never leave your device"
- **Tooltip/Subtexto:** "All processing happens in your browser. We don't upload or store any data."

### Footer
- **Texto:** "Made with ❤️ by [Your Name]"
- **Link:** "How it works" (opcional, pode linkar para explicação técnica)

### Erros Específicos
- **Navegador não suportado:** "Your browser doesn't support this feature. Please use Chrome, Firefox, or Safari."
- **Arquivo muito grande:** "File is too large. Please use files under 50MB."
- **Formato inválido:** "Please select a valid audio file (.ogg, .opus)"

---

## Estados da Aplicação

```typescript
type AppState = 
  | 'idle'           // Waiting for file
  | 'loading'        // Loading ffmpeg.wasm (~31MB, first time)
  | 'ready'          // FFmpeg loaded, file selected
  | 'converting'     // Conversion in progress
  | 'done'           // Conversion complete
  | 'error';         // Error occurred
```

---

## Requisitos de UX

1. **Feedback de carregamento do FFmpeg**: Na primeira conversão, o ffmpeg-core.wasm (~31MB) precisa ser baixado. Mostrar: "Loading converter (first time only)..."

2. **Barra de progresso**: Usar o evento `progress` do ffmpeg para mostrar % da conversão

3. **Validação de arquivo**: Aceitar `.ogg` e `.opus`

4. **Limite de tamanho**: Alertar se arquivo > 50MB

5. **Privacy badge**: Destacar claramente que é 100% client-side

6. **Design clean e moderno**: Fundo escuro ou claro, card central, responsivo

---

## O que NÃO fazer (fora do escopo MVP)

- ❌ Multi-thread (core-mt) - requer configuração mais complexa
- ❌ Conversão em lote (múltiplos arquivos)
- ❌ Preview/player de áudio
- ❌ Edição de metadados
- ❌ PWA/offline
- ❌ Backend/API
- ❌ Autenticação
- ❌ Analytics
- ❌ Internacionalização (i18n) - MVP só em inglês

---

## Features Futuras (ROADMAP.md)

Criar arquivo `ROADMAP.md` com:

```markdown
# WhatsAudio Roadmap

## Phase 2 - Enhanced Features
- [ ] Batch conversion (multiple files)
- [ ] Audio player preview (before/after)
- [ ] More formats (FLAC, OGG output, etc)
- [ ] Quality/bitrate adjustment
- [ ] Dark/light theme toggle

## Phase 3 - PWA & Performance
- [ ] PWA with WASM caching
- [ ] Multi-threaded conversion
- [ ] Offline support

## Phase 4 - Expansion
- [ ] Video to audio extraction
- [ ] Video format conversion
- [ ] i18n (Portuguese, Spanish, etc)

## Phase 5 - Monetization (Optional)
- [ ] Premium features
- [ ] Remove ads option
- [ ] API access
```

---

## Tratamento de Erros

```typescript
// Verificar suporte do navegador
const isSupported = typeof SharedArrayBuffer !== 'undefined';

if (!isSupported) {
  // Mostrar mensagem: "Your browser doesn't support this feature..."
}

// Verificar tamanho do arquivo
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
if (file.size > MAX_SIZE) {
  // Mostrar mensagem: "File is too large..."
}

// Verificar formato
const validFormats = ['.ogg', '.opus'];
const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
if (!validFormats.includes(extension)) {
  // Mostrar mensagem: "Please select a valid audio file..."
}
```

---

## Comandos para Iniciar

```bash
npm create vite@latest whatsaudio -- --template react-ts
cd whatsaudio
npm install @ffmpeg/ffmpeg @ffmpeg/util
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

---

## Hook useFFmpeg Completo

```typescript
import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

type OutputFormat = 'mp3' | 'wav' | 'm4a';

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
    } catch (err) {
      setError('Failed to load converter. Please check your connection.');
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
      
      const blob = new Blob([data], { type: mimeTypes[format] });
      const url = URL.createObjectURL(blob);
      
      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const filename = `${originalName}.${format}`;
      
      return { url, filename };
    } catch (err) {
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
```

---

## Design Sugerido

- **Estilo:** Clean, moderno, minimalista
- **Cores:** 
  - Primary: Verde WhatsApp (#25D366) como accent
  - Background: Dark (#0a0a0a) ou Light (#fafafa)
  - Cards: Subtle contrast
- **Layout:** Card centralizado, responsivo
- **Ícones:** Lucide React ou Heroicons
- **Fontes:** Inter ou system fonts

---

## Checklist Final

- [ ] Projeto criado com nome `whatsaudio`
- [ ] Headers COOP/COEP no vite.config.ts
- [ ] Tailwind CSS configurado
- [ ] @ffmpeg/ffmpeg e @ffmpeg/util instalados
- [ ] Hook useFFmpeg implementado
- [ ] Interface em inglês
- [ ] Upload drag-and-drop funcional
- [ ] Seletor de formato funcional
- [ ] Barra de progresso funcional
- [ ] Download funcional
- [ ] Privacy badge visível
- [ ] Erros tratados com mensagens claras
- [ ] ROADMAP.md criado
- [ ] Testado com arquivo real do WhatsApp
- [ ] Responsivo (mobile-friendly)

---

## Teste Final

1. `npm run dev`
2. Abrir http://localhost:5173
3. Console: verificar `window.crossOriginIsolated === true`
4. Upload de arquivo .ogg do WhatsApp
5. Converter para MP3
6. Baixar e verificar que funciona
7. Testar em mobile (responsive)
