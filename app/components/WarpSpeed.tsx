"use client"
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Float, OrbitControls, Sparkles, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// --- 🔥 The Advanced Accretion Disk Shader (වීඩියෝ එකේ වගේම ගින්දර ගතිය ගන්න) ---
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
      
      // Creating the "Glow" and "Fire" layers
      float ring = smoothstep(0.1, 0.2, dist) * (1.0 - smoothstep(0.45, 0.5, dist));
      float motion = noise(uv + uTime * 0.1);
      
      float finalAlpha = ring * (0.8 + 0.4 * motion);
      vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), pow(finalAlpha, 3.0)); // Hot white core
      
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
    if (mainDiskRef.current) mainDiskRef.current.rotation.z = t * 0.2
    if (topDiskRef.current) topDiskRef.current.rotation.z = -t * 0.15
    if (bottomDiskRef.current) bottomDiskRef.current.rotation.z = t * 0.1
    
    // Updating shaders
    [mainDiskRef, topDiskRef, bottomDiskRef].forEach(ref => {
      if (ref.current) (ref.current.material as any).uniforms.uTime.value = t
    })
  })

  return (
    <group scale={2.5}>
      {/* 1. The Core Shadow */}
      <mesh>
        <sphereGeometry args={[4.8, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* 2. Main Horizontal Disk (මහත වලල්ල) */}
      <mesh ref={mainDiskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <shaderMaterial args={[AccretionDiskMaterial]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* 3. Top Lensing (වීඩියෝ එකේ වගේ උඩින් පේන වක්‍රය) */}
      <mesh ref={topDiskRef} position={[0, 2, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <shaderMaterial args={[AccretionDiskMaterial]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* 4. Bottom Lensing (යටින් පේන වක්‍රය) */}
      <mesh ref={bottomDiskRef} position={[0, -2, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <shaderMaterial args={[AccretionDiskMaterial]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <Sparkles count={3000} scale={40} size={2} speed={0.4} color="#ffcc00" />
    </group>
  )
}

function SceneContent() {
  const scroll = useScroll()
  useFrame((state) => {
    // Cinematic Zoom like the video
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
          <Text fontSize={10} color="#00d4ff" font="/fonts/interstellar.ttf">SINGULARITY</Text>
        </Float>
      </group>
    </>
  )
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleEnter = () => {
    setHasEntered(true)
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio fail", e))
    }
  }

  return (
    <main className="w-full h-screen bg-black relative">
      <audio ref={audioRef} src="/interstellar.mp3" loop />
      
      {!hasEntered ? (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6">
          <h1 className="text-7xl md:text-9xl font-black text-white text-center mb-8 uppercase italic tracking-tighter">
            NEXT WEB<br/><span className="text-[#00d4ff]">SOLUTIONS</span>
          </h1>
          <button 
            onClick={handleEnter}
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