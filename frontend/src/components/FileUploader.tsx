import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploaderProps {
  accept: string
  multiple?: boolean
  files: File[]
  onFilesChange: (files: File[]) => void
  label?: string
}

export function FileUploader({ accept, multiple = false, files, onFilesChange, label }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    onFilesChange(multiple ? [...files, ...dropped] : dropped.slice(0, 1))
  }, [files, multiple, onFilesChange])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    onFilesChange(multiple ? [...files, ...selected] : selected.slice(0, 1))
    e.target.value = ''
  }, [files, multiple, onFilesChange])

  const removeFile = useCallback((index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }, [files, onFilesChange])

  const clearAll = useCallback(() => {
    onFilesChange([])
  }, [onFilesChange])

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border border-dashed transition-all duration-300 cursor-pointer geometric-bg ${
          isDragging
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
        }`}
        style={{ minHeight: '180px' }}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          multiple={multiple}
          accept={accept}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center py-14 px-8 relative z-10">
          <motion.svg
            className="w-10 h-10 text-[var(--color-primary)] mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: isDragging ? -4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </motion.svg>
          <p className="font-serif text-lg text-[var(--color-cream)]">
            {label ?? 'Arraste arquivos aqui'}
          </p>
          <p className="label-mono text-[var(--color-text-muted)] mt-2">
            ou clique para selecionar · {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="eyebrow text-[var(--color-text-muted)]">
                {files.length} arquivo{files.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={clearAll}
                className="label-mono text-[var(--color-text-muted)] hover:text-[var(--color-amber-light)] transition-colors"
              >
                Limpar tudo
              </button>
            </div>

            <div className="space-y-0 max-h-64 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-3 editorial-divider"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text)] truncate">{file.name}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="label-mono text-[var(--color-text-muted)]">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-amber-light)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
