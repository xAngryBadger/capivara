import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function HeaderFooterWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [headerText, setHeaderText] = useState('')
  const [footerText, setFooterText] = useState('')

  const handleApply = useCallback(async () => {
    if (files.length === 0) return
    if (!headerText.trim() && !footerText.trim()) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    formData.append('file', files[0])
    if (headerText.trim()) formData.append('header', headerText)
    if (footerText.trim()) formData.append('footer', footerText)

    try {
      const response = await fetch(apiUrl('/api/header-footer'), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('Header/footer failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newName = files[0].name.replace(/\.pdf$/i, '_hf.pdf')

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
        setResults([{ original: files[0].name, status: 'error', error: 'Erro ao aplicar. Verifique se o backend está online.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files, headerText, footerText])

  return (
    <>
      <div className="mb-6 space-y-4">
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Cabeçalho</label>
          <input
            type="text"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            placeholder="Texto do cabeçalho"
            className="w-full bg-[var(--color-bg)] border-b border-[var(--color-border)] px-0 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <div>
          <label className="eyebrow text-[var(--color-text-muted)] mb-2 block">Rodapé</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Texto do rodapé"
            className="w-full bg-[var(--color-bg)] border-b border-[var(--color-border)] px-0 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-text-muted)]"
          />
        </div>
      </div>

      <FileUploader accept=".pdf" files={files} onFilesChange={setFiles} label="Arraste um arquivo PDF" />

      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleApply}
            disabled={converting || (!headerText.trim() && !footerText.trim())}
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
              ) : 'Aplicar cabeçalho/rodapé'}
            </span>
          </button>
        </div>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
