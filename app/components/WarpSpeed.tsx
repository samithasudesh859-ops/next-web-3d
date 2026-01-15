"use client"
import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Sphere, Float, Sparkles, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!scroll) return
    const targetZ = 10 - (scroll.offset * 100)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    
    const angleX = state.mouse.x * Math.PI * 0.5
    const angleY = state.mouse.y * Math.PI * 0.2
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(angleX) * 10, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, angleY * 5, 0.05)
    state.camera.lookAt(0, 0, targetZ - 20)
    if (meshRef.current) meshRef.current.rotation.y += 0.005
  })

  return (
    <>
      <Stars radius={200} depth={100} count={15000} factor={8} saturation={1} fade speed={1.5} />
      <Sparkles count={600} scale={30} size={3} speed={0.6} color="#ff00ea" />
      <Sparkles count={600} scale={30} size={3} speed={0.6} color="#00d4ff" />
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={meshRef} args={[2, 32, 32]} position={[0, 0, -10]}>
          <meshBasicMaterial color="#00d4ff" wireframe opacity={0.4} transparent />
        </Sphere>
      </Float>
      <Text fontSize={1.2} color="white" position={[0, 2, -5]}>DISCOVER 2036</Text>
      <Text fontSize={0.8} color="white" position={[0, 0, -90]}>WELCOME TO THE NEW ERA</Text>
    </>
  )
}

export default function WarpBackground() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleEnter = (e: React.MouseEvent) => {
    e.stopPropagation() // වෙනත් Click වලට බාධා නොවන ලෙස
    setHasEntered(true)
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Play failed", err))
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">
      <audio ref={audioRef} src="/interstellar.mp3" loop />

      {!hasEntered ? (
        <div className="relative z-[9999] flex flex-col items-center justify-center h-full w-full bg-[#010105]">
          {/* Animated Glow BG */}
          <div className="absolute inset-0 bg-radial-gradient from-[#003344] to-black opacity-30 animate-pulse" />
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]">
            NEXT WEB <span className="text-[#00d4ff]">SOLUTIONS</span>
          </h1>
          <p className="text-[#ff00ea] tracking-[12px] uppercase text-xs md:text-sm mb-16 opacity-80">
            Beyond the Digital Frontier
          </p>
          
          <button 
            onClick={handleEnter}
            className="group relative px-10 py-4 overflow-hidden border-2 border-[#00d4ff] transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 text-[#00d4ff] font-bold tracking-[4px] group-hover:text-black">
              ENTER THE FUTURE
            </span>
            <div className="absolute inset-0 bg-[#00d4ff] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      ) : (
        <Canvas gl={{ antialias: false }}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={90} />
          <ScrollControls pages={12} damping={0.3}>
            <SceneContent />
          </ScrollControls>
        </Canvas>
      )}
    </div>
  )
}