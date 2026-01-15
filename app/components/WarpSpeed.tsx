"use client"
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Float, Sparkles, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// --- Realistic Gargantua (Shader එක optimization කළා ලෝඩ් වෙන්න ලේසි වෙන්න) ---
function Gargantua() {
  const diskRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += 0.01 // හෙමින් කැරකෙන ගතිය
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 1. මධ්‍යයේ කළු බෝලය */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* 2. Accretion Disk - රූපේ විදිහටම දිලිසෙන වලල්ල */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[10, 1.2, 2, 80]} />
        <meshStandardMaterial 
          color="#ff8800" 
          emissive="#ff4400" 
          emissiveIntensity={10} 
          transparent 
          opacity={0.9} 
        />
      </mesh>

      {/* 3. Outer Glow (Gravitational Lensing) */}
      <mesh>
        <sphereGeometry args={[11, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      
      <Sparkles count={2000} scale={30} size={2} speed={1} color="#ffaa00" />
    </group>
  )
}

function SceneContent() {
  const scroll = useScroll()
  const { camera } = useThree()
  
  useFrame(() => {
    // Zoom in/out based on scroll
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 60 - scroll.offset * 120, 0.05)
  })

  return (
    <>
      <color attach="background" args={['#000']} />
      {/* Lights වැඩි කරා Dark Screen එක නැති කරන්න */}
      <ambientLight intensity={2} />
      <pointLight position={[0, 0, 0]} intensity={20} color="#ffaa00" />
      <Stars radius={400} count={20000} factor={8} fade speed={1.5} />
      
      {/* 360 Camera View */}
      <OrbitControls enableZoom={false} enablePan={false} makeDefault />

      <Gargantua />

      <group position={[0, 0, -80]}>
        <Float>
          <Text fontSize={4} color="#00d4ff" textAlign="center">NEXT WEB{"\n"}SOLUTIONS</Text>
        </Float>
      </group>
    </>
  )
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      <audio ref={audioRef} src="/interstellar.mp3" loop />

      {!hasEntered ? (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <h1 className="text-6xl md:text-8xl font-black text-white text-center mb-10 tracking-tighter">
            NEXT WEB<br/><span className="text-[#00d4ff]">SOLUTIONS</span>
          </h1>
          <button 
            onClick={() => { setHasEntered(true); audioRef.current?.play(); }}
            className="px-14 py-5 border-2 border-[#ffaa00] text-[#ffaa00] font-bold tracking-[8px] hover:bg-[#ffaa00] hover:text-black transition-all duration-500"
          >
            ENTER THE FUTURE
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 z-10">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 10, 60], fov: 75 }}>
            <Suspense fallback={null}>
              <ScrollControls pages={6} damping={0.2}>
                <SceneContent />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </div>
      )}
    </main>
  )
}