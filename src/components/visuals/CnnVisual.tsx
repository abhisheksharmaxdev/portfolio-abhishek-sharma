import { motion } from 'motion/react'
import { Frame } from './Frame'

// outputs/training_history.json in internship-task-2
const train = [0.947, 0.9816, 0.9863, 0.9884, 0.9902]
const val = [0.9827, 0.9873, 0.9873, 0.9902, 0.9917]

const W = 300
const H = 150
const x = (i: number) => 30 + (i / 4) * (W - 45)
const y = (v: number) => 12 + (1 - (v - 0.94) / 0.06) * (H - 32)
const line = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(v)}`).join(' ')

const layers = ['Conv 32', 'Pool', 'Conv 64', 'Pool', 'FC 128', 'Out 10']

export function CnnVisual() {
  return (
    <Frame title="training_history.json · MNIST CNN" badge="real output">
      <div className="flex h-full flex-col gap-2 p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full flex-1" role="img" aria-label="Training and validation accuracy over 5 epochs, reaching 99.17% validation accuracy">
          {[0.94, 0.96, 0.98, 1].map((g) => (
            <g key={g}>
              <line x1={30} x2={W - 15} y1={y(g)} y2={y(g)} stroke="var(--border)" />
              <text x={24} y={y(g) + 3} textAnchor="end" fontSize={8} className="fill-[var(--faint)] font-mono">
                {Math.round(g * 100)}%
              </text>
            </g>
          ))}
          {[1, 2, 3, 4, 5].map((e, i) => (
            <text key={e} x={x(i)} y={H - 4} textAnchor="middle" fontSize={8} className="fill-[var(--faint)] font-mono">
              ep{e}
            </text>
          ))}
          <motion.path
            d={line(train)}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
          <motion.path
            d={line(val)}
            fill="none"
            stroke="url(#cnn-grad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
          />
          {val.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={2.5} fill="var(--accent-2)" />
          ))}
          <text x={x(4) - 4} y={y(val[4]) - 8} textAnchor="end" fontSize={9} className="fill-[var(--text)] font-mono">
            val 99.17%
          </text>
          <defs>
            <linearGradient id="cnn-grad" x1="0" x2="1">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-wrap gap-1">
          {layers.map((l, i) => (
            <motion.span
              key={l + i}
              className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.06 }}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
    </Frame>
  )
}
