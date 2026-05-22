import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Preloader } from './components/Preloader'
import { useLenis } from './hooks/useLenis'
import { useHashRouter } from './hooks/useHashRouter'
import { ApiConfig } from './components/ApiConfig'
import { BetaBanner } from './components/BetaBanner'
import { ToolGrid } from './components/ToolGrid'
import { ToolWorkspace } from './components/ToolWorkspace'
import { DocxPdfWorkspace } from './workspaces/DocxPdfWorkspace'
import { XlsxPdfWorkspace } from './workspaces/XlsxPdfWorkspace'
import { CompressWorkspace } from './workspaces/CompressWorkspace'
import { MergeWorkspace } from './workspaces/MergeWorkspace'
import { SplitWorkspace } from './workspaces/SplitWorkspace'
import { RotateWorkspace } from './workspaces/RotateWorkspace'
import { WatermarkWorkspace } from './workspaces/WatermarkWorkspace'
import { PageNumbersWorkspace } from './workspaces/PageNumbersWorkspace'
import { HeaderFooterWorkspace } from './workspaces/HeaderFooterWorkspace'
import { ProtectWorkspace } from './workspaces/ProtectWorkspace'
import { UnlockWorkspace } from './workspaces/UnlockWorkspace'
import { PdfDocxWorkspace } from './workspaces/PdfDocxWorkspace'
import { OcrWorkspace } from './workspaces/OcrWorkspace'
import { PdfToImagesWorkspace } from './workspaces/PdfToImagesWorkspace'
import { PdfaWorkspace } from './workspaces/PdfaWorkspace'

const VALID_TOOLS = new Set([
  'docx-pdf', 'xlsx-pdf', 'compress', 'merge', 'split', 'rotate',
  'watermark', 'page-numbers', 'header-footer', 'protect', 'unlock',
  'pdf-docx', 'ocr', 'pdf-to-images', 'pdfa',
])

const COLAB_URL = 'https://colab.research.google.com/github/xAngryBadger/capivara/blob/main/colab-backend.ipynb'

function WorkspaceSlot({ toolId }: { toolId: string }) {
  switch (toolId) {
    case 'docx-pdf': return <DocxPdfWorkspace />
    case 'xlsx-pdf': return <XlsxPdfWorkspace />
    case 'compress': return <CompressWorkspace />
    case 'merge': return <MergeWorkspace />
    case 'split': return <SplitWorkspace />
    case 'rotate': return <RotateWorkspace />
    case 'watermark': return <WatermarkWorkspace />
    case 'page-numbers': return <PageNumbersWorkspace />
    case 'header-footer': return <HeaderFooterWorkspace />
    case 'protect': return <ProtectWorkspace />
    case 'unlock': return <UnlockWorkspace />
    case 'pdf-docx': return <PdfDocxWorkspace />
    case 'ocr': return <OcrWorkspace />
    case 'pdf-to-images': return <PdfToImagesWorkspace />
    case 'pdfa': return <PdfaWorkspace />
    default: return null
  }
}

function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(() => !localStorage.getItem('badger-beta-banner-dismissed'))
  const { hash } = useHashRouter()

  useLenis()

  const hasWorkspace = hash && VALID_TOOLS.has(hash)

  return (
    <>
      {showPreloader && <Preloader title="Capivara" onComplete={() => setShowPreloader(false)} />}

      <div className="noise-overlay noise-overlay--animated" aria-hidden="true" />

      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0 0)' }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
      >
        <BetaBanner colabUrl={COLAB_URL} onDismiss={() => setBannerVisible(false)} />

        <header className={`fixed left-0 right-0 z-40 fade-border-bottom h-16 flex items-center transition-top duration-300 ${bannerVisible ? 'top-[76px]' : 'top-0'}`} style={{ backdropFilter: 'blur(16px)', backgroundColor: 'rgba(11,15,25,0.8)' }}>
          <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 no-underline">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-8 h-8 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-lg font-serif font-normal tracking-tight text-[var(--color-cream)]">Capivara</h1>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <ApiConfig colabUrl={COLAB_URL} />
              {hasWorkspace && (
                <span className="label-mono text-[var(--color-primary)] hidden sm:inline">{hash}</span>
              )}
            </div>
          </div>
        </header>

        <main className={`max-w-5xl mx-auto px-6 pb-16 lg:px-8 transition-[padding] duration-300 ${bannerVisible ? 'pt-[7rem]' : 'pt-20'}`}>
          <AnimatePresence mode="wait">
            {hasWorkspace && hash ? (
              <motion.div
                key={hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ToolWorkspace toolId={hash}>
                  <WorkspaceSlot toolId={hash} />
                </ToolWorkspace>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ToolGrid />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="fade-border-top px-6 py-6 mt-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="font-serif text-sm text-[var(--color-text-muted)]">
              Desenvolvido por Isaac Nathan
            </p>
            <a
              href="https://github.com/xAngryBadger"
              className="link-underline label-mono text-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
            >
              GitHub
            </a>
          </div>
        </footer>
      </motion.div>
    </>
  )
}

export default App
