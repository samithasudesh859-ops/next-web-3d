"use client"
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Float, Text, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!scroll) return

    // 🏎️ 1. SMOOTH ZOOM (Lerp පාවිච්චි කරලා)
    const targetZ = 5 - (scroll.offset * 80)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)

    // 🚀 2. REALISTIC CAMERA SWAY (Mouse එකට හරිම සිනිදුවට හැරෙන්නේ)
    const targetX = state.mouse.x * 3
    const targetY = state.mouse.y * 2
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.03)
    state.camera.lookAt(0, 0, targetZ - 10)

    // 🔄 බෝලය කැරකෙන වේගය Scroll එක අනුව වැඩි කරමු
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 + (scroll.offset * 0.1)
    }
  })

  return (
    <>
      <Stars radius={100} depth={200} count={12000} factor={6} saturation={0} fade speed={2} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, -5]}>
          {/* 💎 මේ Material එකෙන් බෝලය දිලිසෙන "Energy Ball" එකක් වගේ වෙනවා */}
          <MeshDistortMaterial 
            color="#00f2ff" 
            speed={3} 
            distort={0.3} 
            radius={1}
            emissive="#005e73"
            emissiveIntensity={2}
          />
        </Sphere>
      </Float>

      <Text fontSize={1} color="white" position={[0, 0, -2]} font="/fonts/Geist-Bold.ttf">
        NEXT WEB
      </Text>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={5} color="#00f2ff" />
      <spotLight position={[-10, -10, -10]} intensity={2} color="#ff00ea" />
    </>
  )
}

export default function WarpBackground() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* damping={0.3} නිසා scroll එක හරිම smooth වෙනවා */}
        <ScrollControls pages={8} damping={0.3}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}