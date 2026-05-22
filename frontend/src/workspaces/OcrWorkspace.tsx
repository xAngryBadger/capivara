import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function OcrWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [lang, setLang] = useState('por')

  const langs = [
    { key: 'por', label: 'Português' },
    { key: 'eng', label: 'Inglês' },
    { key: 'spa', label: 'Espanhol' },
    { key: 'por+eng', label: 'Port + Eng' },
  ]

  const handleOcr = useCallback(async () => {
    if (files.length === 0) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('lang', lang)

    try {
      const response = await fetch(apiUrl('/api/ocr'), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('OCR failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newName = files[0].name.replace(/\.pdf$/i, '_ocr.pdf')

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
        setResults([{ original: files[0].name, status: 'error', error: 'Erro no OCR. Verifique se o backend está online e se tesseract está instalado.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files, lang])

  return (
    <>
      <div className="mb-6">
        <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Idioma</label>
        <div className="flex gap-3 flex-wrap">
          {langs.map((l) => (
            <button
              key={l.key}
              onClick={() => setLang(l.key)}
              aria-pressed={lang === l.key}
              className={`py-2 px-4 text-sm transition-all duration-200 ${
                lang === l.key
                  ? 'bg-[var(--color-primary)] text-[var(--color-cream)]'
                  : 'text-[var(--color-text-muted)] border-b border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <FileUploader accept=".pdf" files={files} onFilesChange={setFiles} label="Arraste um PDF escaneado" />

      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleOcr}
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
                  Processando OCR...
                </>
              ) : 'Aplicar OCR'}
            </span>
          </button>
        </div>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
