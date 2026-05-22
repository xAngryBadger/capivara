import { motion, AnimatePresence } from 'framer-motion'

interface ResultItem {
  original: string
  converted?: string
  blobUrl?: string
  status: 'success' | 'error'
  error?: string
  size?: string
}

interface ResultDisplayProps {
  results: ResultItem[]
  onClear?: () => void
}

export function ResultDisplay({ results, onClear }: ResultDisplayProps) {
  if (results.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
      >
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-baseline gap-4">
            <span className="section-number">03</span>
            <h3 className="text-xl font-serif font-normal text-[var(--color-cream)]">Resultados</h3>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="label-mono text-[var(--color-text-muted)] hover:text-[var(--color-amber-light)] transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="space-y-0">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-3 editorial-divider"
            >
              <div className="flex items-center gap-3">
                <span className={result.status === 'success' ? 'text-[var(--color-primary)]' : 'text-[var(--color-amber-light)]'}>
                  {result.status === 'success' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="text-sm text-[var(--color-text)]">{result.original}</p>
                  {result.converted && (
                    <p className="label-mono text-[var(--color-primary)] mt-0.5">→ {result.converted}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {result.size && (
                  <span className="label-mono text-[var(--color-text-muted)] text-xs">{result.size}</span>
                )}
                {result.blobUrl && (
                  <a
                    href={result.blobUrl}
                    download={result.converted}
                    className="label-mono text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors text-xs"
                  >
                    Baixar
                  </a>
                )}
                {result.error && (
                  <span className="label-mono text-[var(--color-amber-light)] text-xs">{result.error}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export type { ResultItem }
