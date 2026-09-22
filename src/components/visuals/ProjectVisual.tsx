import type { ProjectVisual as VisualKey } from '@/content'
import { MindEaseVisual } from './MindEaseVisual'
import { StudentPerformanceVisual } from './StudentPerformanceVisual'
import { SupplyChainVisual } from './SupplyChainVisual'
import { CnnVisual } from './CnnVisual'
import { EtlVisual } from './EtlVisual'

const registry: Record<VisualKey, React.ComponentType> = {
  mindease: MindEaseVisual,
  'student-performance': StudentPerformanceVisual,
  'supply-chain': SupplyChainVisual,
  cnn: CnnVisual,
  etl: EtlVisual,
}

export function ProjectVisual({ visual }: { visual: VisualKey }) {
  const V = registry[visual]
  return <V />
}
