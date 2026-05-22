import { useState, useCallback } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ResultDisplay, type ResultItem } from '../components/ResultDisplay'
import { apiUrl, apiHeaders } from '../lib/api'

export function RotateWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [angle, setAngle] = useState(90)

  const angles = [90, 180, 270]

  const handleRotate = useCallback(async () => {
    if (files.length === 0) return
    setConverting(true)
    setResults([])

    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('angle', String(angle))

    try {
      const response = await fetch(apiUrl('/api/rotate'), {
        method: 'POST',
        body: formData,
        headers: apiHeaders(),
      })

      if (!response.ok) throw new Error('Rotation failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newName = files[0].name.replace(/\.pdf$/i, `_rotated_${angle}.pdf`)

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
        setResults([{ original: files[0].name, status: 'error', error: 'Erro ao rotacionar. Verifique se o backend está online.' }])
      }
    } finally {
      setConverting(false)
    }
  }, [files, angle])

  return (
    <>
      <div className="mb-6">
        <div className="flex gap-3">
          {angles.map((a) => (
            <button
              key={a}
              onClick={() => setAngle(a)}
              aria-pressed={angle === a}
              className={`py-3 px-6 text-sm transition-all duration-200 ${
                angle === a
                  ? 'bg-[var(--color-primary)] text-[var(--color-cream)]'
                  : 'text-[var(--color-text-muted)] border-b border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              {a}°
            </button>
          ))}
        </div>
      </div>

      <FileUploader accept=".pdf" files={files} onFilesChange={setFiles} label="Arraste um arquivo PDF" />

      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleRotate}
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
                  Rotacionando...
                </>
              ) : `Rotacionar ${angle}°`}
            </span>
          </button>
        </div>
      )}

      <ResultDisplay results={results} onClear={() => setResults([])} />
    </>
  )
}
