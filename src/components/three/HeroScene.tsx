import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SHAPES } from './shapes'

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uCamDist;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vColor;
  varying float vAlpha;

  float ease(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    float delay = aRand * 0.35;
    float t = ease(clamp((uProgress - delay) / 0.65, 0.0, 1.0));
    vec3 p = mix(aFrom, aTo, t);
    // particles bulge outward mid-transition for a fluid morph
    p += normalize(p + 0.0001) * sin(t * 3.14159) * 0.35 * aRand;
    // idle drift
    p += 0.018 * vec3(
      sin(uTime * 0.8 + aRand * 20.0),
      cos(uTime * 0.7 + aRand * 17.0),
      sin(uTime * 0.6 + aRand * 13.0)
    );

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // pointer repulsion in view space
    vec2 m = uMouse * (-mv.z / uCamDist);
    vec2 dir = mv.xy - m;
    float f = smoothstep(0.85, 0.0, length(dir)) * uMouseStrength;
    mv.xy += normalize(dir + 0.0001) * f * 0.32;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.9) * (uCamDist / -mv.z);

    vColor = mix(uColorA, uColorB, smoothstep(-2.2, 2.2, p.x + p.y * 0.6));
    vAlpha = 0.45 + 0.55 * aRand + f * 0.8;
  }
`

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`

interface CloudProps {
  count: number
  shapeIndex: number
  theme: 'dark' | 'light'
  reduced: boolean
}

const CAM_DIST = 6

function MorphCloud({ count, shapeIndex, theme, reduced }: CloudProps) {
  const group = useRef<THREE.Group>(null)
  const { gl, viewport, camera } = useThree()
  const targets = useMemo(() => SHAPES.map((s) => s.build(count)), [count])
  const prevIndex = useRef(shapeIndex)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const rand = new Float32Array(count)
    for (let i = 0; i < count; i++) rand[i] = Math.random()
    g.setAttribute('position', new THREE.BufferAttribute(targets[0].slice(), 3))
    g.setAttribute('aFrom', new THREE.BufferAttribute(targets[0].slice(), 3))
    g.setAttribute('aTo', new THREE.BufferAttribute(targets[0].slice(), 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)
    return g
  }, [count, targets])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uProgress: { value: 1 },
          uTime: { value: 0 },
          uSize: { value: 2.6 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseStrength: { value: reduced ? 0 : 1 },
          uCamDist: { value: CAM_DIST },
          uColorA: { value: new THREE.Color() },
          uColorB: { value: new THREE.Color() },
          uOpacity: { value: 1 },
        },
      }),
    [],
  )

  // Theme-dependent colours / blending
  useEffect(() => {
    const dark = theme === 'dark'
    material.uniforms.uColorA.value.set(dark ? '#a78bfa' : '#6d28d9')
    material.uniforms.uColorB.value.set(dark ? '#22d3ee' : '#0e7490')
    material.uniforms.uOpacity.value = dark ? 0.9 : 0.85
    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
    material.needsUpdate = true
  }, [theme, material])

  // Start a morph whenever the requested shape changes
  useEffect(() => {
    if (prevIndex.current === shapeIndex) return
    const from = geometry.getAttribute('aFrom') as THREE.BufferAttribute
    const to = geometry.getAttribute('aTo') as THREE.BufferAttribute
    ;(from.array as Float32Array).set(targets[prevIndex.current])
    ;(to.array as Float32Array).set(targets[shapeIndex])
    from.needsUpdate = true
    to.needsUpdate = true
    material.uniforms.uProgress.value = reduced ? 1 : 0
    prevIndex.current = shapeIndex
  }, [shapeIndex, geometry, targets, material, reduced])

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  const mouse = useRef(new THREE.Vector2(99, 99))

  useFrame((state, delta) => {
    const u = material.uniforms
    const dt = Math.min(delta, 0.05)
    u.uTime.value += reduced ? 0 : dt
    if (u.uProgress.value < 1) u.uProgress.value = Math.min(1, u.uProgress.value + dt * 0.55)

    // pointer → world units on the z=0 plane (eased)
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0])
    const p = state.pointer
    const inside = Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1
    const tx = inside ? (p.x * vp.width) / 2 : 99
    const ty = inside ? (p.y * vp.height) / 2 : 99
    mouse.current.x += (tx - mouse.current.x) * (Math.abs(tx) > 50 ? 1 : 0.12)
    mouse.current.y += (ty - mouse.current.y) * (Math.abs(ty) > 50 ? 1 : 0.12)
    u.uMouse.value.copy(mouse.current)

    const g = group.current
    if (!g) return
    // desktop: sit to the right of the headline; mobile: centred behind it
    const wide = vp.width > 7.5
    const targetX = wide ? vp.width * 0.235 : 0
    const targetScale = wide ? Math.min(1, vp.width / 10) : Math.min(1, vp.width / 5.6)
    g.position.x += (targetX - g.position.x) * 0.08
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * 0.08)

    if (!reduced) {
      g.rotation.y += dt * 0.09
      const tiltX = (inside ? -p.y : 0) * 0.25
      g.rotation.x += (tiltX - g.rotation.x) * 0.05
      g.rotation.z += ((inside ? p.x : 0) * 0.06 - g.rotation.z) * 0.05
    }
  })

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}

/** Faint background dust for depth. */
function Dust({ count, theme }: { count: number; theme: 'dark' | 'light' }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      a[i * 3] = r * Math.sin(ph) * Math.cos(th)
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      a[i * 3 + 2] = r * Math.cos(ph) - 3
    }
    return a
  }, [count])
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y -= Math.min(d, 0.05) * 0.015
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        sizeAttenuation
        transparent
        depthWrite={false}
        color={theme === 'dark' ? '#8f8ab8' : '#6b6690'}
        opacity={theme === 'dark' ? 0.55 : 0.4}
      />
    </points>
  )
}

export interface HeroSceneProps {
  shapeIndex: number
  theme: 'dark' | 'light'
  reduced: boolean
  active: boolean
  compact: boolean
  eventSource: RefObject<HTMLElement | null>
  onReady?: () => void
}

export default function HeroScene({ shapeIndex, theme, reduced, active, compact, eventSource, onReady }: HeroSceneProps) {
  const count = compact ? 4200 : 9000
  return (
    <Canvas
      camera={{ position: [0, 0, CAM_DIST], fov: 45, near: 0.1, far: 50 }}
      dpr={[1, compact ? 1.5 : 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      onCreated={() => onReady?.()}
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      <MorphCloud count={count} shapeIndex={shapeIndex} theme={theme} reduced={reduced} />
      <Dust count={compact ? 250 : 600} theme={theme} />
    </Canvas>
  )
}
