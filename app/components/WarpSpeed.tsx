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

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
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
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#010105]">
      <audio ref={audioRef} src="/interstellar.mp3" loop />

      {/* 🔘 මේක තමයි මියුසික් බටන් එක */}
      <button 
        onClick={toggleMusic}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '12px 24px',
          background: 'transparent',
          color: '#00d4ff',
          border: '2px solid #00d4ff',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        {isPlaying ? "PAUSE MISSION" : "PLAY MISSION"}
      </button>

      <Canvas gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={90} />
        <ScrollControls pages={12} damping={0.3}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}