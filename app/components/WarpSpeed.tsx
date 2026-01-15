"use client"
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Float, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!scroll) return

    // 🏎️ 1. ZOOM EFFECT (කැමරාව ඇතුළට යනවා)
    // Scroll කරද්දී කැමරාව Z: 5 ඉඳන් Z: -50 දක්වා වේගයෙන් යනවා
    state.camera.position.z = 5 - (scroll.offset * 60)

    // 🚀 2. Cam Parallax (Mouse එකට පොඩ්ඩක් හැරෙනවා)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 2, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 2, 0.05)
    
    // බෝලය කැරකෙන්න දෙමු
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <>
      {/* තරු ගොඩක් ඈතට යනකම් විහිදෙන්න දැම්මා */}
      <Stars radius={100} depth={200} count={10000} factor={6} saturation={0} fade speed={2} />
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.2, 32, 32]} position={[0, 0, -5]}>
          <meshStandardMaterial color="#00d4ff" />
        </Sphere>
      </Float>

      <Text fontSize={0.8} color="white" position={[0, 0, -2]}>
        NEXT WEB
      </Text>

      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
    </>
  )
}

export default function WarpBackground() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-black">
      {/* pages={15} දැම්මා ගොඩක් දුර යන්න පුළුවන් වෙන්න */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ScrollControls pages={15} damping={0.1}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}