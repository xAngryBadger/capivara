import type { ComponentType } from 'react'
import { DocxPdfWorkspace } from './DocxPdfWorkspace'
import { XlsxPdfWorkspace } from './XlsxPdfWorkspace'
import { CompressWorkspace } from './CompressWorkspace'
import { MergeWorkspace } from './MergeWorkspace'
import { SplitWorkspace } from './SplitWorkspace'
import { RotateWorkspace } from './RotateWorkspace'
import { WatermarkWorkspace } from './WatermarkWorkspace'
import { PageNumbersWorkspace } from './PageNumbersWorkspace'
import { HeaderFooterWorkspace } from './HeaderFooterWorkspace'
import { ProtectWorkspace } from './ProtectWorkspace'
import { UnlockWorkspace } from './UnlockWorkspace'
import { PdfDocxWorkspace } from './PdfDocxWorkspace'
import { OcrWorkspace } from './OcrWorkspace'
import { PdfToImagesWorkspace } from './PdfToImagesWorkspace'
import { PdfaWorkspace } from './PdfaWorkspace'

const workspaceMap: Record<string, ComponentType> = {
  'docx-pdf': DocxPdfWorkspace,
  'xlsx-pdf': XlsxPdfWorkspace,
  compress: CompressWorkspace,
  merge: MergeWorkspace,
  split: SplitWorkspace,
  rotate: RotateWorkspace,
  watermark: WatermarkWorkspace,
  'page-numbers': PageNumbersWorkspace,
  'header-footer': HeaderFooterWorkspace,
  protect: ProtectWorkspace,
  unlock: UnlockWorkspace,
  'pdf-docx': PdfDocxWorkspace,
  ocr: OcrWorkspace,
  'pdf-to-images': PdfToImagesWorkspace,
  pdfa: PdfaWorkspace,
}

export function getWorkspace(toolId: string): ComponentType | undefined {
  return workspaceMap[toolId]
}
