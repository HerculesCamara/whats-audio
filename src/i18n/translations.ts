export type Lang = 'en' | 'pt'

export const BASE_URL = 'https://whatsaudio.herculescamara.com'

export const translations = {
  en: {
    meta: {
      homeTitle: 'WhatsAudio — Free WhatsApp Voice Message to MP3 Converter',
      homeDesc: 'Convert WhatsApp voice messages (.ogg/.opus) to MP3, WAV or M4A for free. Works 100% in your browser — no upload, no account needed. Fast, private and secure.',
      howTitle: 'How WhatsAudio Works — Browser-Based Audio Conversion',
      howDesc: 'Learn how WhatsAudio converts WhatsApp voice messages to MP3 entirely in your browser using FFmpeg WebAssembly. No upload, no server, 100% private.',
    },
    header: {
      tagline: 'Convert WhatsApp voice messages to MP3 — 100% in your browser',
    },
    privacy: {
      badge: 'Your files never leave your device',
      note: "All processing happens in your browser. We don't upload or store any data.",
    },
    upload: {
      title: 'Drop your audio file here',
      subtitle: 'or click to browse',
      formats: 'Accepts .ogg, .opus files',
      errorSize: 'File is too large. Please use files under 50MB.',
      errorFormat: 'Please select a valid audio file (.ogg, .opus)',
    },
    format: {
      label: 'Convert to:',
      mp3Desc: 'Most compatible',
      wavDesc: 'Uncompressed',
      m4aDesc: 'Apple / AAC',
    },
    progress: {
      loading: 'Loading converter (first time only)...',
      converting: (p: number) => `Converting... ${p}%`,
    },
    download: {
      done: 'Done! Your file is ready.',
      button: (name: string) => `Download ${name}`,
      another: 'Convert another file',
    },
    ui: {
      convertBtn: 'Convert',
      tryAgain: 'Try again',
      browserError: "Your browser doesn't support this feature. Please use Chrome, Firefox, or Safari.",
      genericError: 'Something went wrong. Please try again.',
    },
    howSection: {
      title: 'How It Works',
      steps: [
        { title: 'Upload your file', desc: 'Select or drag a .ogg or .opus file exported from WhatsApp.' },
        { title: 'Choose a format', desc: 'Pick MP3, WAV, or M4A depending on where you want to play the audio.' },
        { title: 'Download', desc: 'Click Convert and download instantly. No waiting, no email, no account.' },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
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
          a: 'Input: .ogg and .opus (the format WhatsApp uses for voice messages). Output: MP3, WAV, or M4A.',
        },
        {
          q: "Why can't I play WhatsApp voice messages on my computer?",
          a: "WhatsApp saves voice messages as .ogg files using the Opus codec. Most media players don't support it natively. Converting to MP3 or WAV makes them compatible with any player.",
        },
        {
          q: 'Does WhatsAudio work on mobile?',
          a: 'Yes, WhatsAudio works on any modern browser, including Chrome and Safari on Android and iOS.',
        },
      ],
    },
    footer: {
      made: 'Made with ❤️ · WhatsAudio',
      howItWorks: 'How it works',
    },
    howPage: {
      title: 'How WhatsAudio Works',
      intro: "WhatsAudio converts WhatsApp voice messages entirely inside your browser using FFmpeg compiled to WebAssembly. Your files never touch a server — not even for a millisecond.",
      problem: {
        title: "The Problem: WhatsApp's Audio Format",
        p1: 'WhatsApp saves all voice messages as .ogg files using the Opus audio codec. Opus is excellent for voice quality at low bitrates, which is why WhatsApp uses it — but it comes with a catch.',
        p2: "Most media players (Windows Media Player, iTunes, QuickTime), video editors, and messaging apps don't support the OGG/Opus format natively. If you try to open a WhatsApp voice message on your computer, chances are nothing will play it. Converting to MP3 or WAV makes the file universally compatible.",
      },
      tech: {
        title: 'The Technology: FFmpeg + WebAssembly',
        p1: 'FFmpeg is the industry-standard open-source library for audio and video processing — it powers YouTube, VLC, Handbrake, and thousands of other tools. Traditionally, FFmpeg runs as a server-side or desktop application. That changed with WebAssembly.',
        p2: 'WebAssembly (WASM) allows native-speed code to run directly in the browser. The @ffmpeg/ffmpeg library compiles the entire FFmpeg engine to WASM, making it possible to run full audio conversion inside a browser tab — no plugins, no extensions, no server.',
        codeLabel: 'The conversion command under the hood',
      },
      steps: {
        title: 'What Happens Step by Step',
        items: [
          { title: 'You select a .ogg or .opus file', body: 'The file is read by the browser using the File API. Nothing is transmitted anywhere.' },
          { title: 'FFmpeg.wasm loads (~31 MB, first time only)', body: 'The WebAssembly binary is downloaded from a CDN and cached by your browser. On subsequent conversions it loads instantly.' },
          { title: 'The file is written to a virtual filesystem', body: 'FFmpeg.wasm creates an in-memory virtual filesystem using SharedArrayBuffer. Your file is written there — it never leaves your device.' },
          { title: 'FFmpeg runs the conversion', body: 'The conversion executes entirely in a Web Worker, so your browser stays responsive while FFmpeg processes the audio.' },
          { title: 'The output file is offered for download', body: 'The converted file is read from the virtual filesystem, turned into a Blob URL, and presented as a download button. Done.' },
        ],
      },
      privacy: {
        title: "Why It's 100% Private",
        p1: "Most online converters upload your file to a server, process it there, and send it back. That means a third party receives and (temporarily or permanently) stores your audio. For personal voice messages, that's a real privacy concern.",
        p2: "WhatsAudio has no backend. There is no server receiving files. The entire conversion pipeline runs inside your browser tab using WebAssembly. The only network request is downloading the FFmpeg WASM binary — your audio file stays on your device throughout.",
      },
      browser: {
        title: 'Browser Requirements',
        p1: 'FFmpeg.wasm relies on SharedArrayBuffer and requires the page to be served in a cross-origin isolated context (COOP + COEP headers). WhatsAudio configures these headers automatically.',
        colBrowser: 'Browser',
        colVersion: 'Min. Version',
        colStatus: 'Status',
        supported: 'Supported',
      },
      cta: 'Convert a file now',
    },
  },

  pt: {
    meta: {
      homeTitle: 'WhatsAudio — Conversor Gratuito de Áudio do WhatsApp para MP3',
      homeDesc: 'Converta mensagens de voz do WhatsApp (.ogg/.opus) para MP3, WAV ou M4A gratuitamente. Funciona 100% no seu navegador — sem upload, sem cadastro. Rápido, privado e seguro.',
      howTitle: 'Como o WhatsAudio Funciona — Conversão de Áudio no Navegador',
      howDesc: 'Saiba como o WhatsAudio converte mensagens de voz do WhatsApp para MP3 direto no seu navegador usando FFmpeg WebAssembly. Sem upload, sem servidor, 100% privado.',
    },
    header: {
      tagline: 'Converta mensagens de voz do WhatsApp para MP3 — 100% no seu navegador',
    },
    privacy: {
      badge: 'Seus arquivos nunca saem do seu dispositivo',
      note: 'Todo o processamento acontece no seu navegador. Não fazemos upload nem armazenamos nenhum dado.',
    },
    upload: {
      title: 'Solte seu arquivo de áudio aqui',
      subtitle: 'ou clique para buscar',
      formats: 'Aceita arquivos .ogg, .opus',
      errorSize: 'Arquivo muito grande. Use arquivos com menos de 50MB.',
      errorFormat: 'Selecione um arquivo de áudio válido (.ogg, .opus)',
    },
    format: {
      label: 'Converter para:',
      mp3Desc: 'Mais compatível',
      wavDesc: 'Sem compressão',
      m4aDesc: 'Apple / AAC',
    },
    progress: {
      loading: 'Carregando conversor (só na primeira vez)...',
      converting: (p: number) => `Convertendo... ${p}%`,
    },
    download: {
      done: 'Pronto! Seu arquivo está pronto.',
      button: (name: string) => `Baixar ${name}`,
      another: 'Converter outro arquivo',
    },
    ui: {
      convertBtn: 'Converter',
      tryAgain: 'Tentar novamente',
      browserError: 'Seu navegador não suporta esse recurso. Use Chrome, Firefox ou Safari.',
      genericError: 'Algo deu errado. Por favor, tente novamente.',
    },
    howSection: {
      title: 'Como Funciona',
      steps: [
        { title: 'Envie seu arquivo', desc: 'Selecione ou arraste um arquivo .ogg ou .opus exportado do WhatsApp.' },
        { title: 'Escolha o formato', desc: 'Escolha MP3, WAV ou M4A conforme onde você quer usar o áudio.' },
        { title: 'Baixe', desc: 'Clique em Converter e baixe instantaneamente. Sem espera, sem e-mail, sem cadastro.' },
      ],
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          q: 'Como converter mensagem de voz do WhatsApp para MP3?',
          a: 'Faça upload do arquivo .ogg ou .opus do WhatsApp, selecione o formato MP3 e clique em Converter. O arquivo estará pronto para baixar em segundos — totalmente no seu navegador, sem enviar nada para nenhum servidor.',
        },
        {
          q: 'O WhatsAudio é gratuito?',
          a: 'Sim, totalmente gratuito. Sem cadastro, sem assinatura, sem taxas ocultas.',
        },
        {
          q: 'Meus arquivos ficam seguros? O WhatsAudio faz upload de alguma coisa?',
          a: 'Seus arquivos nunca saem do seu dispositivo. Toda a conversão roda localmente no seu navegador usando WebAssembly (FFmpeg). Nada é enviado para nenhum servidor.',
        },
        {
          q: 'Quais formatos são suportados?',
          a: 'Entrada: .ogg e .opus (o formato que o WhatsApp usa para mensagens de voz). Saída: MP3, WAV ou M4A.',
        },
        {
          q: 'Por que não consigo reproduzir mensagens de voz do WhatsApp no computador?',
          a: 'O WhatsApp salva as mensagens de voz como arquivos .ogg usando o codec Opus. A maioria dos players de mídia não suporta esse formato nativamente. Converter para MP3 ou WAV torna o arquivo compatível com qualquer player.',
        },
        {
          q: 'O WhatsAudio funciona no celular?',
          a: 'Sim, funciona em qualquer navegador moderno, incluindo Chrome e Safari no Android e iOS.',
        },
      ],
    },
    footer: {
      made: 'Feito com ❤️ · WhatsAudio',
      howItWorks: 'Como funciona',
    },
    howPage: {
      title: 'Como o WhatsAudio Funciona',
      intro: 'O WhatsAudio converte mensagens de voz do WhatsApp inteiramente dentro do seu navegador usando o FFmpeg compilado para WebAssembly. Seus arquivos nunca tocam um servidor — nem por um milissegundo.',
      problem: {
        title: 'O Problema: O Formato de Áudio do WhatsApp',
        p1: 'O WhatsApp salva todas as mensagens de voz como arquivos .ogg usando o codec de áudio Opus. O Opus é excelente para qualidade de voz em baixas taxas de bits, por isso o WhatsApp o utiliza — mas isso traz um problema.',
        p2: 'A maioria dos players de mídia (Windows Media Player, iTunes, QuickTime), editores de vídeo e aplicativos não suportam o formato OGG/Opus nativamente. Se você tentar abrir uma mensagem de voz do WhatsApp no computador, provavelmente nada vai reproduzir. Converter para MP3 ou WAV torna o arquivo universalmente compatível.',
      },
      tech: {
        title: 'A Tecnologia: FFmpeg + WebAssembly',
        p1: 'O FFmpeg é a biblioteca open-source padrão da indústria para processamento de áudio e vídeo — ele alimenta o YouTube, VLC, Handbrake e milhares de outras ferramentas. Tradicionalmente, o FFmpeg roda no servidor ou como aplicação desktop. Isso mudou com o WebAssembly.',
        p2: 'O WebAssembly (WASM) permite que código nativo rode diretamente no navegador em velocidade nativa. A biblioteca @ffmpeg/ffmpeg compila todo o motor do FFmpeg para WASM, tornando possível rodar a conversão completa de áudio dentro de uma aba do navegador — sem plugins, sem extensões, sem servidor.',
        codeLabel: 'O comando de conversão por baixo dos panos',
      },
      steps: {
        title: 'O Que Acontece Passo a Passo',
        items: [
          { title: 'Você seleciona um arquivo .ogg ou .opus', body: 'O arquivo é lido pelo navegador usando a File API. Nada é transmitido para nenhum lugar.' },
          { title: 'O FFmpeg.wasm carrega (~31 MB, só na primeira vez)', body: 'O binário WebAssembly é baixado de uma CDN e armazenado em cache pelo navegador. Nas conversões seguintes, carrega instantaneamente.' },
          { title: 'O arquivo é gravado em um sistema de arquivos virtual', body: 'O FFmpeg.wasm cria um sistema de arquivos virtual na memória usando SharedArrayBuffer. Seu arquivo é gravado lá — nunca sai do seu dispositivo.' },
          { title: 'O FFmpeg executa a conversão', body: 'A conversão acontece inteiramente em um Web Worker, então o navegador continua responsivo enquanto o FFmpeg processa o áudio.' },
          { title: 'O arquivo de saída é disponibilizado para download', body: 'O arquivo convertido é lido do sistema de arquivos virtual, transformado em um Blob URL e apresentado como botão de download. Pronto.' },
        ],
      },
      privacy: {
        title: 'Por Que É 100% Privado',
        p1: 'A maioria dos conversores online faz upload do seu arquivo para um servidor, processa lá e devolve. Isso significa que um terceiro recebe e (temporária ou permanentemente) armazena seu áudio. Para mensagens de voz pessoais, isso é uma preocupação real de privacidade.',
        p2: 'O WhatsAudio não tem backend. Não existe servidor recebendo arquivos. Todo o pipeline de conversão roda dentro da aba do seu navegador usando WebAssembly. A única requisição de rede é o download do binário WASM do FFmpeg — seu arquivo de áudio permanece no seu dispositivo o tempo todo.',
      },
      browser: {
        title: 'Requisitos de Navegador',
        p1: 'O FFmpeg.wasm depende do SharedArrayBuffer e requer que a página seja servida em um contexto cross-origin isolado (headers COOP + COEP). O WhatsAudio configura esses headers automaticamente.',
        colBrowser: 'Navegador',
        colVersion: 'Versão Mín.',
        colStatus: 'Status',
        supported: 'Compatível',
      },
      cta: 'Converter um arquivo agora',
    },
  },
} as const
