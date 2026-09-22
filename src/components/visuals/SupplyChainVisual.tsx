import { motion } from 'motion/react'
import { Frame } from './Frame'

// Optimal shipment plan from internship-task-4 README.
const warehouses = ['Mumbai', 'Delhi', 'Ahmedabad']
const stores = ['Jaipur', 'Surat', 'Pune', 'Indore']
const plan: Record<string, Record<string, number>> = {
  Mumbai: { Jaipur: 0, Surat: 0, Pune: 130, Indore: 20 },
  Delhi: { Jaipur: 100, Surat: 0, Pune: 0, Indore: 100 },
  Ahmedabad: { Jaipur: 0, Surat: 120, Pune: 0, Indore: 60 },
}

const W = 420
const H = 260
const wy = (i: number) => 55 + i * 75
const sy = (i: number) => 38 + i * 61

export function SupplyChainVisual() {
  const routes = warehouses.flatMap((w, wi) =>
    stores.map((s, si) => ({ w, s, wi, si, q: plan[w][s] })),
  )
  return (
    <Frame title="optimal_shipments.csv · PuLP" badge="real output">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Optimal shipment network: 3 warehouses supplying 4 stores">
        {routes.map(({ w, s, wi, si, q }) => {
          const d = `M 110 ${wy(wi)} C 210 ${wy(wi)}, 210 ${sy(si)}, 310 ${sy(si)}`
          return (
            <g key={w + s}>
              <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="2 4" opacity={q ? 0 : 0.7} />
              {q > 0 && (
                <>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#sc-grad)"
                    strokeWidth={1 + q / 28}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.9 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: 0.2 + wi * 0.15 + si * 0.05, ease: 'easeInOut' }}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--text)"
                    strokeOpacity={0.55}
                    strokeWidth={1.2}
                    strokeDasharray="3 21"
                    style={{ animation: 'dash 1.1s linear infinite' }}
                  />
                  {(() => {
                    // Stack this warehouse's route labels beside it, ordered top-to-bottom by store.
                    const active = stores.filter((st) => plan[w][st] > 0)
                    const k = active.indexOf(s)
                    const ly = wy(wi) + (k - (active.length - 1) / 2) * 17
                    return (
                      <g transform={`translate(136 ${ly})`}>
                        <rect x={-13} y={-7} width={26} height={14} rx={7} fill="var(--bg-elev)" stroke="var(--border-strong)" />
                        <text y={3} textAnchor="middle" className="fill-[var(--text)] font-mono" fontSize={8.5}>
                          {q}
                        </text>
                      </g>
                    )
                  })()}
                </>
              )}
            </g>
          )
        })}
        {warehouses.map((w, i) => (
          <g key={w}>
            <rect x={14} y={wy(i) - 15} width={96} height={30} rx={8} fill="var(--surface-2)" stroke="var(--border-strong)" />
            <circle cx={28} cy={wy(i)} r={4} fill="var(--accent)" />
            <text x={38} y={wy(i) + 4} fontSize={11} className="fill-[var(--text)] font-sans">{w}</text>
          </g>
        ))}
        {stores.map((s, i) => (
          <g key={s}>
            <rect x={310} y={sy(i) - 14} width={92} height={28} rx={8} fill="var(--surface-2)" stroke="var(--border-strong)" />
            <circle cx={324} cy={sy(i)} r={4} fill="var(--accent-2)" />
            <text x={334} y={sy(i) + 4} fontSize={11} className="fill-[var(--text)] font-sans">{s}</text>
          </g>
        ))}
        <defs>
          <linearGradient id="sc-grad" x1="0" x2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between font-mono text-[0.62rem] text-faint">
        <span>warehouses → stores · units shipped</span>
        <span>
          min cost <span className="text-fg">1,950</span>
        </span>
      </div>
    </Frame>
  )
}
