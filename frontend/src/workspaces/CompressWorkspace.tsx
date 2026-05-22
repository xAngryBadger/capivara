import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function CompressWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [quality, setQuality] = useState<'screen' | 'ebook' | 'printer' | 'prepress'>('ebook')

  const qualityOptions = [
    { key: 'screen' as const, label: 'Tela', desc: '72 dpi — menor tamanho' },
    { key: 'ebook' as const, label: 'Ebook', desc: '150 dpi — equilíbrio' },
    { key: 'printer' as const, label: 'Impressora', desc: '300 dpi — alta qualidade' },
    { key: 'prepress' as const, label: 'Pré-impressão', desc: '300 dpi — máxima' },
  ]

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    formData.append('file', files[0])

    try {
      const response = await fetch(apiUrl(`/api/convert/pdf-compress?quality=${quality}`), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('Compression failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newName = files[0].name.replace(/\.pdf$/i, '_comprimido.pdf')
      const saved = files[0].size - blob.size
      const pct = ((saved / files[0].size) * 100).toFixed(1)

      setResults([{
        original: `${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`,
        converted: newName,
        blobUrl,
        status: 'success',
        size: `${(blob.size / 1024).toFixed(1)} KB (${saved > 0 ? '-' : '+'}${Math.abs(Number(pct))}%)`,
      }])
    } catch (error) {
      if (error instanceof Error && error.message === 'NO_API_URL') {
        alert('Configure a URL da API primeiro. Clique em "Sem API" no header.')
      } else {
        setResults([{ original: files[0].name, status: 'error', error: 'Erro na compressão. Verifique se o backend está online.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files, quality])

  return (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {qualityOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setQuality(opt.key)}
              aria-pressed={quality === opt.key}
              className={`group relative py-4 px-4 text-left transition-all duration-200 ${
                quality === opt.key
                  ? 'bg-[var(--color-primary)] text-[var(--color-cream)]'
                  : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border-b border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              <span className="block text-sm font-medium">{opt.label}</span>
              <span className={`block label-mono mt-1 ${quality === opt.key ? 'text-[var(--color-cream)]/70' : 'text-[var(--color-text-muted)]'}`}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <FileUploader accept=".pdf" files={files} onFilesChange={setFiles} label="Arraste um arquivo PDF" />

      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleConvert}
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
                  Comprimindo...
                </>
              ) : 'Comprimir PDF'}
            </span>
          </button>
        </div>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
