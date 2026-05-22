import { motion } from 'framer-motion'
import { getToolById } from '../lib/tools'
import { useHashRouter } from '../hooks/useHashRouter'

interface ToolWorkspaceProps {
  toolId: string
  children: React.ReactNode
}

export function ToolWorkspace({ toolId, children }: ToolWorkspaceProps) {
  const tool = getToolById(toolId)
  const { goBack } = useHashRouter()

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-[var(--color-text-muted)]">Ferramenta não encontrada</p>
        <button onClick={goBack} className="btn-clipped mt-6">
          <span className="btn-text-back text-sm">Voltar</span>
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={goBack}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-cream)] transition-colors"
          aria-label="Voltar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <svg
          className="w-6 h-6 text-[var(--color-primary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
        </svg>
        <div>
          <h2 className="text-2xl font-serif font-normal text-[var(--color-cream)]">{tool.label}</h2>
          <p className="label-mono text-[var(--color-text-muted)] mt-0.5">{tool.description}</p>
        </div>
      </div>

      <div className="editorial-divider pb-6 mb-8">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="section-number">01</span>
          <h3 className="text-xl font-serif font-normal text-[var(--color-cream)]">Configurar</h3>
        </div>
        {children}
      </div>
    </motion.div>
  )
}
