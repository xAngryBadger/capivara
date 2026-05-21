import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getApiUrl, setApiUrl } from '../lib/api'

export function ApiConfig() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setUrl(getApiUrl())
  }, [])

  const handleSave = () => {
    setApiUrl(url)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setOpen(false)
    }, 1200)
  }

  const handleClear = () => {
    setUrl('')
    setApiUrl('')
    setOpen(false)
  }

  const isConnected = !!getApiUrl()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-200 border ${
          isConnected
            ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
            : 'border-[var(--color-amber-light)] text-[var(--color-amber-light)]'
        }`}
        aria-label="Configure API URL"
      >
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-amber-light)]'}`} />
        <span className="label-mono text-xs">
          {isConnected ? 'API Online' : 'Sem API'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-4 z-50"
          >
            <p className="eyebrow text-[var(--color-text-muted)] mb-3">API Backend URL</p>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xxxx.ngrok-free.app"
              className="w-full bg-[var(--color-bg)] border-b border-[var(--color-border)] px-0 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-text-muted)]"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Cole a URL do ngrok (Google Colab). Salva no localStorage.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleSave}
                className="btn-clipped flex-1"
              >
                <span className="btn-text-back text-xs font-semibold">
                  {saved ? 'Salvo!' : 'Salvar'}
                </span>
              </button>
              {isConnected && (
                <button
                  onClick={handleClear}
                  className="px-3 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-amber-light)] transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
