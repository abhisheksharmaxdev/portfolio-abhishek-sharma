import { motion } from 'motion/react'
import { Frame } from './Frame'

// From outputs/metrics.json in internship-task-3.
const models = [
  { name: 'Linear Regression', r2: 0.795, mae: 3.7293, rmse: 4.7995, best: true },
  { name: 'Random Forest', r2: 0.654, mae: 4.8109, rmse: 6.2343, best: false },
]

export function StudentPerformanceVisual() {
  return (
    <Frame title="metrics.json · model comparison" badge="real output">
      <div className="grid h-full grid-rows-[1fr_auto] gap-3 p-4">
        <div className="space-y-4">
          {models.map((m, i) => (
            <div key={m.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-fg">
                  {m.name}
                  {m.best && (
                    <span className="rounded-full bg-accent-2/15 px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-wider text-accent-2">
                      best
                    </span>
                  )}
                </span>
                <span className="font-mono text-muted">R² {m.r2.toFixed(3)}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: m.best
                      ? 'linear-gradient(90deg, var(--accent), var(--accent-2))'
                      : 'var(--border-strong)',
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.r2 * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="mt-1.5 flex gap-4 font-mono text-[0.65rem] text-faint">
                <span>MAE {m.mae.toFixed(2)}</span>
                <span>RMSE {m.rmse.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-line bg-surface/70 p-3 font-mono text-[0.66rem] leading-relaxed">
          <div className="text-faint">
            <span className="text-accent-2">POST</span> /predict
          </div>
          <div className="text-muted">
            {'{ '}
            <span className="text-accent">"prediction"</span>: <span className="text-fg">97.37</span>, …{' }'}
          </div>
        </div>
      </div>
    </Frame>
  )
}
