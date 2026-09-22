/**
 * Point-cloud generators for the hero scene. Each returns `count` xyz points,
 * so any shape can morph into any other.
 */

function rng(seed: number) {
  // Deterministic PRNG (mulberry32) so shapes look the same on every load.
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())
}

/** "Data" — a Fibonacci sphere with a slightly noisy shell. */
export function dataSphere(count: number, radius = 1.75) {
  const r = rng(7)
  const out = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = golden * i
    const shell = radius * (1 + (r() - 0.5) * 0.08) * (r() < 0.12 ? 0.55 + r() * 0.35 : 1)
    out[i * 3] = Math.cos(th) * rad * shell
    out[i * 3 + 1] = y * shell
    out[i * 3 + 2] = Math.sin(th) * rad * shell
  }
  return out
}

/** "Model" — a small feed-forward neural network: nodes + weighted edges. */
export function neuralNet(count: number) {
  const r = rng(21)
  const layers = [4, 7, 8, 7, 3]
  const width = 4.2
  const nodes: [number, number, number][][] = layers.map((n, li) => {
    const x = -width / 2 + (li / (layers.length - 1)) * width
    return Array.from({ length: n }, (_, i) => {
      const y = (i - (n - 1) / 2) * 0.52
      return [x, y, (r() - 0.5) * 0.25] as [number, number, number]
    })
  })
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    if (r() < 0.38) {
      // cluster around a node
      const layer = nodes[Math.floor(r() * nodes.length)]
      const n = layer[Math.floor(r() * layer.length)]
      const s = 0.07
      out[i * 3] = n[0] + gauss(r) * s
      out[i * 3 + 1] = n[1] + gauss(r) * s
      out[i * 3 + 2] = n[2] + gauss(r) * s
    } else {
      // sit on an edge between adjacent layers
      const li = Math.floor(r() * (nodes.length - 1))
      const a = nodes[li][Math.floor(r() * nodes[li].length)]
      const b = nodes[li + 1][Math.floor(r() * nodes[li + 1].length)]
      const t = r()
      out[i * 3] = a[0] + (b[0] - a[0]) * t
      out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + gauss(r) * 0.008
      out[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + gauss(r) * 0.008
    }
  }
  return out
}

/** "Optimize" — a loss landscape surface with a descent path into the minimum. */
export function lossLandscape(count: number) {
  const r = rng(99)
  const out = new Float32Array(count * 3)
  const f = (x: number, z: number) =>
    0.55 * Math.sin(1.3 * x) * Math.cos(1.1 * z) - 0.9 * Math.exp(-((x - 0.6) ** 2 + (z + 0.3) ** 2) / 0.9) + 0.06 * (x * x + z * z)
  const size = 4.4
  const pathCount = Math.floor(count * 0.06)
  for (let i = 0; i < count; i++) {
    let x: number, z: number
    if (i < pathCount) {
      // gradient-descent-ish path from a corner into the basin
      const t = i / pathCount
      const e = 1 - Math.pow(1 - t, 2.2)
      x = -1.8 + (0.6 + 1.8) * e + Math.sin(t * 14) * 0.18 * (1 - t)
      z = 1.6 + (-0.3 - 1.6) * e + Math.cos(t * 11) * 0.15 * (1 - t)
      out[i * 3 + 1] = f(x, z) + 0.05
    } else {
      // grid lines look cleaner than pure random scatter
      const lines = 34
      if (r() < 0.5) {
        x = -size / 2 + Math.floor(r() * lines) * (size / (lines - 1))
        z = -size / 2 + r() * size
      } else {
        z = -size / 2 + Math.floor(r() * lines) * (size / (lines - 1))
        x = -size / 2 + r() * size
      }
      out[i * 3 + 1] = f(x, z)
    }
    out[i * 3] = x
    out[i * 3 + 2] = z
  }
  // Tilt the surface toward the camera so it reads as a landscape, not a line.
  const a = 0.62
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  for (let i = 0; i < count; i++) {
    const y = out[i * 3 + 1]
    const z = out[i * 3 + 2]
    out[i * 3 + 1] = y * ca - z * sa - 0.1
    out[i * 3 + 2] = y * sa + z * ca
  }
  return out
}

export const SHAPES = [
  { key: 'data', label: 'Data', build: dataSphere },
  { key: 'model', label: 'Model', build: neuralNet },
  { key: 'optimize', label: 'Optimize', build: lossLandscape },
] as const
