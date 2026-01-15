"use client"
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Float, Sparkles, PerspectiveCamera, OrbitControls, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// --- 1. Real Gargantua Shader (අර රූපේ විදිහටම වලල්ල පේන්න) ---
function Gargantua() {
  const diskRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    diskRef.current.rotation.z = state.clock.getElapsedTime() * 0.2
  })

  return (
    <group position={[0, 0, 0]}>
      {/* කළු කුහරයේ මැද (Event Horizon) */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Accretion Disk - රූපේ තියෙන විදිහටම වලල්ල පේන්න */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[11, 1.5, 2, 120]} />
        <meshStandardMaterial 
          color="#ff8800" 
          emissive="#ff4400" 
          emissiveIntensity={15} 
          transparent 
          opacity={0.9} 
        />
      </mesh>

      {/* Gravitational Lensing (ආලෝකය නැවෙන ගතිය) */}
      <mesh>
        <sphereGeometry args={[12, 64, 64]} />
        <MeshDistortMaterial
          color="#ffaa00"
          speed={3}
          distort={0.4}
          radius={1}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <Sparkles count={4000} scale={40} size={2.5} speed={1.5} color="#ffaa00" />
    </group>
  )
}

function SceneContent() {
  const scroll = useScroll()
  const { camera } = useThree()
  
  useFrame(() => {
    // Scroll එකෙන් ඇතුළට යන එක පාලනය වෙනවා
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 60 - scroll.offset * 120, 0.05)
  })

  return (
    <>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 0, 0]} intensity={30} color="#ffaa00" />
      <Stars radius={500} count={50000} factor={10} fade speed={2} />
      
      {/* 360 MOUSE VIEW (Orbit Controls) - මේක තමයි මවුස් එකෙන් කැරකෙන්න දෙන්නේ */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        makeDefault 
        rotateSpeed={0.5}
      />

      <Gargantua />

      {/* Content Section */}
      <group position={[0, 0, -80]}>
        <Float>
          <Text fontSize={4} color="#00d4ff" textAlign="center" font="/fonts/neon.ttf">
            NEXT WEB{"\n"}SOLUTIONS
          </Text>
        </Float>
      </group>
    </>
  )
}

export default function InterstellarApp() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Music ප්ලේ වෙන්නෙත් බටන් එක එබුවමයි
  const startExperience = () => {
    setHasEntered(true)
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Music Error: ", e))
    }
  }

  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      {/* Music file එක 'public' folder එකේ 'interstellar.mp3' නමින් තිබිය යුතුයි */}
      <audio ref={audioRef} src="/interstellar.mp3" loop />

      {!hasEntered ? (
        // --- Intro Screen ---
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#010105]">
          <h1 className="text-6xl md:text-9xl font-black text-white text-center mb-10 tracking-tighter uppercase">
            NEXT WEB<br/><span className="text-[#00d4ff]">SOLUTIONS</span>
          </h1>
          <button 
            onClick={startExperience}
            className="px-16 py-6 border-2 border-[#ffaa00] text-[#ffaa00] font-bold tracking-[10px] hover:bg-[#ffaa00] hover:text-black transition-all duration-700 uppercase"
          >
            Enter The Future
          </button>
        </div>
      ) : (
        // --- 3D Canvas ---
        <div className="absolute inset-0 z-10">
          <Canvas dpr={[1, 2]}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault fov={75} position={[0, 10, 60]} />
              <ScrollControls pages={10} damping={0.25}>
                <SceneContent />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </div>
      )}
    </main>
  )
}