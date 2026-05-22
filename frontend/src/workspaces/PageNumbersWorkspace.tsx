import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function PageNumbersWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'top-center' | 'top-right'>('bottom-center')
  const [startAt, setStartAt] = useState(1)

  const positions = [
    { key: 'bottom-center' as const, label: 'Rodapé centro' },
    { key: 'bottom-right' as const, label: 'Rodapé direita' },
    { key: 'top-center' as const, label: 'Cabeçalho centro' },
    { key: 'top-right' as const, label: 'Cabeçalho direita' },
  ]

  const handleAddNumbers = useCallback(async () => {
    if (files.length === 0) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('position', position)
    formData.append('start_at', String(startAt))

    try {
      const response = await fetch(apiUrl('/api/page-numbers'), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('Page numbers failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newName = files[0].name.replace(/\.pdf$/i, '_numerado.pdf')

      setResults([{
        original: files[0].name,
        converted: newName,
        blobUrl,
        status: 'success',
        size: `${(blob.size / 1024).toFixed(1)} KB`,
      }])
    } catch (error) {
      if (error instanceof Error && error.message === 'NO_API_URL') {
        alert('Configure a URL da API primeiro. Clique em "Sem API" no header.')
      } else {
        setResults([{ original: files[0].name, status: 'error', error: 'Erro ao numerar. Verifique se o backend está online.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files, position, startAt])

  return (
    <>
      <div className="mb-6 space-y-4">
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Posição</label>
          <div className="grid grid-cols-2 gap-3">
            {positions.map((p) => (
              <button
                key={p.key}
                onClick={() => setPosition(p.key)}
                aria-pressed={position === p.key}
                className={`py-3 px-4 text-sm text-left transition-all duration-200 ${
                  position === p.key
                    ? 'bg-[var(--color-primary)] text-[var(--color-cream)]'
                    : 'text-[var(--color-text-muted)] border-b border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Começar em: {startAt}</label>
          <input
            type="number"
            min={1}
            value={startAt}
            onChange={(e) => setStartAt(Math.max(1, Number(e.target.value)))}
            className="w-24 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-2 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono"
          />
        </div>
      </div>

      <FileUploader accept=".pdf" files={files} onFilesChange={setFiles} label="Arraste um arquivo PDF" />

      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleAddNumbers}
            disabled={converting}
            className="btn-clipped w-full"
          >
            <span className="btn-text-back flex items-center justify-center gap-2 font-semibold text-sm tracking-wide">
              {converting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Numerando...
                </>
              ) : 'Numerar páginas'}
            </span>
          </button>
        </div>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
