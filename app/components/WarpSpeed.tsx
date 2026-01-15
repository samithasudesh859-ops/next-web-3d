"use client"
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Float, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!scroll) return

    // 🚀 1. Cam Parallax (Mouse එකට හැරෙන එක)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 2, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 2, 0.05)
    state.camera.lookAt(0, 0, 0)

    // 🏎️ 2. ඉස්සරහට යන ගතිය (The Warp Effect)
    // Scroll කරද්දී මුළු Scene එකම කැමරාව දෙසට එනවා
    if (groupRef.current) {
      // scroll.offset එක 0 සිට 1 දක්වා යනවා. ඒක 50 කින් විතර වැඩි කළාම තමයි Depth එක එන්නේ.
      groupRef.current.position.z = scroll.offset * 50 
    }
  })

  return (
    // මුළු සෙල්ලම තියෙන්නේ මේ group එක ඇතුළේ
    <group ref={groupRef}>
      {/* තරු ගොඩක් ඈතට විහිදෙන්න දැම්මා */}
      <Stars radius={100} depth={100} count={7000} factor={4} saturation={0} fade speed={2} />
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 32, 32]} position={[0, 0, -5]}>
          <meshStandardMaterial color="#00d4ff" />
        </Sphere>
      </Float>

      <Text fontSize={0.8} color="white" position={[0, 0, -2]}>
        NEXT WEB
      </Text>

      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
    </group>
  )
}

export default function WarpBackground() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-black">
      {/* pages={10} දැම්මම ගොඩක් වෙලා scroll කරන්න පුළුවන් */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ScrollControls pages={10} damping={0.1}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}