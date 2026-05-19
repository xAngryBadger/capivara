import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete?: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const animateSmooth = useCallback(() => {
    let visual = 0
    let target = 0
    let loaded = 0
    const assets = [...document.images, ...document.querySelectorAll('link[rel="stylesheet"]')]
    const total = assets.length || 1

    function step() {
      visual += (target - visual) * 0.08
      setProgress(Math.round(visual))

      if (visual < 99.5) {
        requestAnimationFrame(step)
      } else {
        setProgress(100)
        setTimeout(() => {
          setIsComplete(true)
          onComplete?.()
        }, 300)
      }
    }

    function done() {
      loaded++
      if (loaded > total) loaded = total
      target = (loaded / total) * 100
    }

    assets.forEach((el) => {
      if ((el as HTMLImageElement).complete || (el as HTMLLinkElement).sheet) {
        done()
      } else {
        el.addEventListener('load', done, { once: true })
        el.addEventListener('error', done, { once: true })
      }
    })

    setTimeout(() => {
      loaded = total
      target = 100
    }, 3000)

    window.addEventListener('load', () => {
      loaded = total
      target = 100
    })

    requestAnimationFrame(step)
  }, [onComplete])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    animateSmooth()
    return () => {
      document.body.style.overflow = ''
    }
  }, [animateSmooth])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="text-center mb-12"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="eyebrow text-[var(--color-sage)] mb-4"
            >
              Badger Tools
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="text-4xl md:text-5xl font-serif font-normal tracking-wide text-[var(--color-cream)]"
            >
              DocX Converter
            </motion.h1>
          </motion.div>

          <div className="w-full max-w-xs px-8">
            <div className="w-full h-[2px] bg-[var(--color-border)] overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-sage)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'linear' }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="label-mono text-[var(--color-text-muted)] mt-3 text-center"
            >
              {progress}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
