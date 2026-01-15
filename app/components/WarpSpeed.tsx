"use client"
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Float, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// --- 🔥 The Advanced Accretion Disk Shader ---
const AccretionDiskMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffaa00") },
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

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      float ring = smoothstep(0.1, 0.2, dist) * (1.0 - smoothstep(0.45, 0.5, dist));
      float motion = noise(uv + uTime * 0.1);
      float finalAlpha = ring * (0.8 + 0.4 * motion);
      vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), pow(finalAlpha, 3.0));
      gl_FragColor = vec4(color * 2.5, finalAlpha);
    }
  `
}

function BlackHole() {
  const mainDiskRef = useRef<THREE.Mesh>(null!)
  const topDiskRef = useRef<THREE.Mesh>(null!)
  const bottomDiskRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (mainDiskRef.current) {
      mainDiskRef.current.rotation.z = t * 0.2
      // TypeScript error එක නැති කරන්න මෙහෙම ලියමු
      const mat = mainDiskRef.current.material as THREE.ShaderMaterial
      if (mat.uniforms) mat.uniforms.uTime.value = t
    }
    if (topDiskRef.current) {
      topDiskRef.current.rotation.z = -t * 0.15
      const mat = topDiskRef.current.material as THREE.ShaderMaterial
      if (mat.uniforms) mat.uniforms.uTime.value = t
    }
    if (bottomDiskRef.current) {
      bottomDiskRef.current.rotation.z = t * 0.1
      const mat = bottomDiskRef.current.material as THREE.ShaderMaterial
      if (mat.uniforms) mat.uniforms.uTime.value = t
    }
  })

  return (
    <group scale={2.5}>
      <mesh>
        <sphereGeometry args={[4.8, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      <mesh ref={mainDiskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <shaderMaterial attach="material" args={[AccretionDiskMaterial]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={topDiskRef} position={[0, 2, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <shaderMaterial attach="material" args={[AccretionDiskMaterial]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={bottomDiskRef} position={[0, -2, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <shaderMaterial attach="material" args={[AccretionDiskMaterial]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <Sparkles count={3000} scale={40} size={2} speed={0.4} color="#ffcc00" />
    </group>
  )
}

function SceneContent() {
  const scroll = useScroll()
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 100 - scroll.offset * 180, 0.05)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <color attach="background" args={['#000']} />
      <Stars radius={300} count={40000} factor={10} fade speed={1} />
      <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      <BlackHole />
      <group position={[0, 0, -150]}>
        <Float>
          <Text fontSize={10} color="#00d4ff">SINGULARITY</Text>
        </Float>
      </group>
    </>
  )
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return (
    <main className="w-full h-screen bg-black relative">
      <audio ref={audioRef} src="/interstellar.mp3" loop />
      {!hasEntered ? (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 text-center">
          <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic">
            NEXT WEB<br/><span className="text-[#00d4ff]">SOLUTIONS</span>
          </h1>
          <button 
            onClick={() => { setHasEntered(true); audioRef.current?.play(); }}
            className="px-16 py-6 border-2 border-[#ffaa00] text-[#ffaa00] font-bold tracking-[15px] hover:bg-[#ffaa00] hover:text-black transition-all duration-700 uppercase"
          >
            ENTER THE FUTURE
          </button>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 20, 100], fov: 55 }}>
          <Suspense fallback={null}>
            <ScrollControls pages={25} damping={0.3}>
              <SceneContent />
            </ScrollControls>
          </Suspense>
        </Canvas>
      )}
    </main>
  )
}