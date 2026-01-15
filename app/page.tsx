"use client"
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Float, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// --- 🔥 FINAL CINEMATIC GARGANTUA SHADER ---
const FinalGargantuaShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffa000") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    void main() {
      float d = distance(vUv, vec2(0.5));
      float ring = smoothstep(0.12, 0.22, d) * (1.0 - smoothstep(0.48, 0.5, d));
      float fire = ring * (0.8 + 0.4 * sin(uTime * 2.0 + d * 10.0));
      vec3 color = uColor * fire * 3.5;
      color += vec3(1.0, 0.9, 0.6) * pow(fire, 4.0);
      gl_FragColor = vec4(color, fire);
    }
  `
}

function GargantuaScene() {
  const diskRef = useRef<THREE.Mesh>(null!)
  const topRef = useRef<THREE.Mesh>(null!)
  const scroll = useScroll()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (diskRef.current) {
      diskRef.current.rotation.z = t * 0.1
      ;(diskRef.current.material as any).uniforms.uTime.value = t
    }
    if (topRef.current) {
      topRef.current.rotation.z = -t * 0.08
      ;(topRef.current.material as any).uniforms.uTime.value = t
    }
    // Zoom control with scroll
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 100 - scroll.offset * 180, 0.05)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group scale={2.5}>
      <mesh><sphereGeometry args={[4.9, 64, 64]} /><meshBasicMaterial color="black" /></mesh>
      <mesh ref={diskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[35, 35]} />
        <shaderMaterial args={[FinalGargantuaShader]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={topRef} position={[0, 1.5, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[32, 32]} />
        <shaderMaterial args={[FinalGargantuaShader]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <Sparkles count={4000} scale={50} size={2} speed={0.5} color="#ffaa00" />
    </group>
  )
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return (
    <main className="w-full h-screen bg-black relative">
      <audio ref={audioRef} src="/interstellar.mp3" loop />
      {!hasEntered ? (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <h1 className="text-7xl font-black text-white text-center mb-10 tracking-tighter uppercase">NEXT WEB<br/><span className="text-[#00d4ff]">SOLUTIONS</span></h1>
          <button onClick={() => { setHasEntered(true); audioRef.current?.play(); }} className="px-16 py-6 border-2 border-[#ffaa00] text-[#ffaa00] font-bold tracking-[10px] hover:bg-[#ffaa00] hover:text-black transition-all duration-700">ENTER FUTURE</button>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 20, 100], fov: 55 }}>
          <Suspense fallback={null}>
            <ScrollControls pages={20} damping={0.3}><GargantuaScene /></ScrollControls>
          </Suspense>
        </Canvas>
      )}
    </main>
  )
}