"use client"
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!scroll) return

    // 🏎️ Ultra Smooth Zoom
    const targetZ = 5 - (scroll.offset * 60)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)

    // 🚀 Smooth Sway
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.5, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.5, 0.03)
    state.camera.lookAt(0, 0, targetZ - 10)

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <>
      <Stars radius={100} depth={200} count={6000} factor={4} saturation={0} fade speed={1.5} />
      
      <Sphere ref={meshRef} args={[1.5, 32, 32]} position={[0, 0, -5]}>
        {/* 💡 සරලම Material එක - මේක Crash වෙන්නේ නැහැ */}
        <meshBasicMaterial color="#00d4ff" wireframe />
      </Sphere>

      <Text fontSize={0.8} color="white" position={[0, 0, -2]}>
        NEXT WEB
      </Text>
    </>
  )
}

export default function WarpBackground() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-black">
      {/* gl={{ antialias: false }} දාලා performance වැඩි කළා */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: false, powerPreference: "low-power" }}>
        <ScrollControls pages={6} damping={0.4}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}