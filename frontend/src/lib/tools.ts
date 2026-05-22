export type ToolCategory = 'convert' | 'optimize' | 'organize' | 'security' | 'annotate'

export interface ToolConfig {
  id: string
  label: string
  description: string
  icon: string
  category: ToolCategory
  acceptTypes: string
  multiple: boolean
  requiresBackend: boolean
}

export const TOOL_CATEGORIES: { key: ToolCategory; label: string }[] = [
  { key: 'convert', label: 'Converter' },
  { key: 'optimize', label: 'Otimizar' },
  { key: 'organize', label: 'Organizar' },
  { key: 'security', label: 'Segurança' },
  { key: 'annotate', label: 'Anotar' },
]

export const TOOLS: ToolConfig[] = [
  {
    id: 'docx-pdf',
    label: 'DOCX → PDF',
    description: 'Word para PDF',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    category: 'convert',
    acceptTypes: '.docx',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'xlsx-pdf',
    label: 'XLSX → PDF',
    description: 'Excel para PDF',
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    category: 'convert',
    acceptTypes: '.xlsx',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'pdf-docx',
    label: 'PDF → DOCX',
    description: 'PDF para Word',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    category: 'convert',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'compress',
    label: 'Comprimir PDF',
    description: 'Reduzir tamanho',
    icon: 'M19 14l-7 7m0 0l-7-7m7 7V3',
    category: 'optimize',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'pdf-to-images',
    label: 'PDF → Imagens',
    description: 'Páginas em PNG/JPG',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    category: 'convert',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'merge',
    label: 'Mesclar PDF',
    description: 'Juntar arquivos',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    category: 'organize',
    acceptTypes: '.pdf',
    multiple: true,
    requiresBackend: true,
  },
  {
    id: 'split',
    label: 'Dividir PDF',
    description: 'Extrair páginas',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    category: 'organize',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'rotate',
    label: 'Rotacionar PDF',
    description: 'Girar páginas',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    category: 'organize',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'watermark',
    label: 'Marca d\'água',
    description: 'Texto ou imagem',
    icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    category: 'annotate',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'page-numbers',
    label: 'Numeração',
    description: 'Páginas numeradas',
    icon: 'M7 20l4-16m2 16l4-16M6 9h16M4 15h16',
    category: 'annotate',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'header-footer',
    label: 'Cabeçalho/Rodapé',
    description: 'Texto nas margens',
    icon: 'M4 6h16M4 18h16',
    category: 'annotate',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'protect',
    label: 'Proteger PDF',
    description: 'Adicionar senha',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    category: 'security',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'unlock',
    label: 'Desbloquear PDF',
    description: 'Remover senha',
    icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
    category: 'security',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'pdfa',
    label: 'PDF/A',
    description: 'Arquivamento longo prazo',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    category: 'security',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
  {
    id: 'ocr',
    label: 'OCR PDF',
    description: 'Texto selecionável',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    category: 'optimize',
    acceptTypes: '.pdf',
    multiple: false,
    requiresBackend: true,
  },
]

export function getToolById(id: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.id === id)
}

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return TOOLS.filter((t) => t.category === category)
}
