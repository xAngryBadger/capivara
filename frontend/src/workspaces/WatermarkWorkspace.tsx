import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function WatermarkWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [text, setText] = useState('CONFIDENCIAL')
  const [opacity, setOpacity] = useState(30)
  const [fontSize, setFontSize] = useState(48)

  const handleWatermark = useCallback(async () => {
    if (files.length === 0) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('text', text)
    formData.append('opacity', String(opacity / 100))
    formData.append('font_size', String(fontSize))

    try {
      const response = await fetch(apiUrl('/api/watermark'), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('Watermark failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newName = files[0].name.replace(/\.pdf$/i, '_watermark.pdf')

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
        setResults([{ original: files[0].name, status: 'error', error: 'Erro ao adicionar marca d\'água. Verifique se o backend está online.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files, text, opacity, fontSize])

  return (
    <>
      <div className="mb-6 space-y-4">
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Texto</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[var(--color-bg)] border-b border-[var(--color-border)] px-0 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Opacidade: {opacity}%</label>
          <input
            type="range"
            min={5}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Tamanho: {fontSize}px</label>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>
      </div>

      <FileUploader accept=".pdf" files={files} onFilesChange={setFiles} label="Arraste um arquivo PDF" />

      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleWatermark}
            disabled={converting || !text.trim()}
            className="btn-clipped w-full"
          >
            <span className="btn-text-back flex items-center justify-center gap-2 font-semibold text-sm tracking-wide">
              {converting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Aplicando...
                </>
              ) : 'Aplicar marca d\'água'}
            </span>
          </button>
        </div>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
