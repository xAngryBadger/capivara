import { motion } from 'framer-motion'
import { TOOLS, TOOL_CATEGORIES, type ToolConfig, type ToolCategory } from '../lib/tools'
import { useHashRouter } from '../hooks/useHashRouter'

export function ToolGrid() {
  const { navigate } = useHashRouter()

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
        className="mb-12 text-center"
      >
        <p className="eyebrow text-[var(--color-primary)] mb-3">Suíte de Ferramentas</p>
        <h2 className="text-3xl md:text-4xl font-serif font-normal text-[var(--color-cream)] leading-tight">
          Tudo para seus PDFs.<br />
          <span className="text-[var(--color-amber-light)]">Grátis. Privado.</span>
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)] max-w-lg mx-auto">
          Converta, comprima, mescle, divida, proteja — e muito mais.
          Sem upload para servidores de terceiros.
        </p>
      </motion.div>

      {TOOL_CATEGORIES.map((cat, catIndex) => (
        <CategorySection
          key={cat.key}
          category={cat}
          tools={TOOLS.filter((t) => t.category === cat.key)}
          onSelect={(tool) => navigate(tool.id)}
          delay={catIndex * 0.1}
        />
      ))}
    </div>
  )
}

function CategorySection({
  category,
  tools,
  onSelect,
  delay,
}: {
  category: { key: ToolCategory; label: string }
  tools: ToolConfig[]
  onSelect: (tool: ToolConfig) => void
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
      className="mb-10 editorial-divider pb-2"
    >
      <div className="flex items-baseline gap-4 mb-5">
        <span className="section-number">{category.label.slice(0, 2).toUpperCase()}</span>
        <h3 className="text-xl font-serif font-normal text-[var(--color-cream)]">{category.label}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelect(tool)}
            className="group relative py-5 px-4 text-left transition-all duration-200 bg-[var(--color-bg)] border-b border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-alt)]"
          >
            <svg
              className="w-6 h-6 text-[var(--color-accent)] mb-3 opacity-40 group-hover:opacity-100 group-hover:text-[var(--color-primary)] transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
            </svg>
            <span className="block text-sm font-medium text-[var(--color-cream)]">{tool.label}</span>
            <span className="block label-mono mt-1 text-[var(--color-text-muted)]">{tool.description}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
