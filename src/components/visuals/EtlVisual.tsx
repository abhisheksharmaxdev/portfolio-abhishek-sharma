import { motion } from 'motion/react'
import { Frame } from './Frame'

const stages = [
  { k: 'E', name: 'Extract', desc: 'customer_data.csv' },
  { k: 'T', name: 'Transform', desc: 'impute · encode · scale' },
  { k: 'L', name: 'Load', desc: 'train / test splits' },
]
const outputs = ['cleaned_data.csv', 'X_train_transformed.csv', 'X_test_transformed.csv', 'y_train.csv', 'y_test.csv', 'metadata.json', 'preprocessor.joblib']

export function EtlVisual() {
  return (
    <Frame title="etl_pipeline.py" badge="pipeline">
      <div className="flex h-full flex-col justify-between gap-3 p-4">
        <div className="flex items-center">
          {stages.map((s, i) => (
            <div key={s.k} className="flex flex-1 items-center">
              <motion.div
                className="flex-1 rounded-lg border border-line bg-surface-2 p-2 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i }}
              >
                <div className="font-display text-lg font-bold text-gradient">{s.k}</div>
                <div className="text-[0.68rem] text-fg">{s.name}</div>
                <div className="mt-0.5 hidden font-mono text-[0.56rem] text-faint sm:block">{s.desc}</div>
              </motion.div>
              {i < stages.length - 1 && (
                <div className="relative mx-1 h-px w-5 bg-line-strong">
                  <span className="absolute -top-[3px] left-0 size-[7px] rounded-full bg-accent-2 [animation:etl-flow_1.6s_linear_infinite]" />
                </div>
              )}
            </div>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[0.6rem] text-muted">
          {outputs.map((o, i) => (
            <motion.li
              key={o}
              className="truncate"
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              <span className="text-accent-2">✓</span> {o}
            </motion.li>
          ))}
        </ul>
      </div>
    </Frame>
  )
}
