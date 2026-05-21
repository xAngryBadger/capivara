import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BANNER_KEY = 'badger-beta-banner-dismissed'

export function BetaBanner() {
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem(BANNER_KEY))

  useEffect(() => {
    if (dismissed) localStorage.setItem(BANNER_KEY, '1')
  }, [dismissed])

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 overflow-hidden bg-[var(--color-primary)] text-[var(--color-cream)]"
        >
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <p className="text-xs leading-relaxed">
              <span className="label-mono font-semibold mr-1.5">BETA</span>
              O backend roda no Google Colab (grátis). Clique em{' '}
              <span className="label-mono font-semibold">Sem API</span> no header para configurar a URL.
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] transition-colors"
              aria-label="Fechar aviso"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
