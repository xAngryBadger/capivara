import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function MergeWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))

    try {
      const response = await fetch(apiUrl('/api/merge'), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('Merge failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      setResults([{
        original: `${files.length} PDFs mesclados`,
        converted: 'merged.pdf',
        blobUrl,
        status: 'success',
        size: `${(blob.size / 1024).toFixed(1)} KB`,
      }])
    } catch (error) {
      if (error instanceof Error && error.message === 'NO_API_URL') {
        alert('Configure a URL da API primeiro. Clique em "Sem API" no header.')
      } else {
        setResults([{ original: 'Merge', status: 'error', error: 'Erro ao mesclar. Verifique se o backend está online.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files])

  return (
    <>
      <FileUploader accept=".pdf" multiple files={files} onFilesChange={setFiles} label="Arraste múltiplos PDFs" />

      {files.length >= 2 && (
        <div className="mt-6">
          <button
            onClick={handleMerge}
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
                  Mesclando...
                </>
              ) : `Mesclar ${files.length} PDFs`}
            </span>
          </button>
        </div>
      )}

      {files.length > 0 && files.length < 2 && (
        <p className="label-mono text-[var(--color-amber-light)] mt-4 text-center">Adicione pelo menos 2 PDFs para mesclar</p>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
