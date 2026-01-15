"use client"
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Sphere, Float, Sparkles, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!scroll) return
    
    // 🏎️ 1. Ultra-Wide Zoom
    const targetZ = 10 - (scroll.offset * 100)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    
    // 🔄 2. 360-Degree Realistic Sway (Mobile Optimized)
    // Mouse එක හරි Touch එක හරි අනුව කැමරාව ලොකු වපසරියක කැරකෙනවා
    const angleX = state.mouse.x * Math.PI * 0.5 // අංශක 90ක් දෙපැත්තට
    const angleY = state.mouse.y * Math.PI * 0.2
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(angleX) * 10, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, angleY * 5, 0.05)
    state.camera.lookAt(0, 0, targetZ - 20)

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002
    }
  })

  return (
    <>
      {/* 🌌 පට්ට ලොකු Space එකක් පේන්න තරු ගාණ වැඩි කළා */}
      <Stars radius={200} depth={100} count={15000} factor={8} saturation={1} fade speed={1.5} />
      
      {/* 🔮 වටේටම විහිදුණු Sci-Fi වයිබ් එක */}
      <Sparkles count={600} scale={30} size={3} speed={0.6} color="#ff00ea" />
      <Sparkles count={600} scale={30} size={3} speed={0.6} color="#00d4ff" />
      
      <group position={[0, 0, 0]}>
        <Float speed={3} rotationIntensity={1} floatIntensity={2}>
          <Sphere ref={meshRef} args={[2, 32, 32]} position={[0, 0, -10]}>
            <meshBasicMaterial color="#00d4ff" wireframe opacity={0.4} transparent />
          </Sphere>
        </Float>

        {/* 2036 Content Layers */}
        <Text fontSize={1.2} color="white" position={[0, 2, -5]}>DISCOVER 2036</Text>
        <Text fontSize={0.5} color="#ff00ea" position={[10, 0, -30]}>NEURAL INTERFACE: ACTIVE</Text>
        <Text fontSize={0.5} color="#00d4ff" position={[-10, 2, -60]}>QUANTUM STORAGE: 100%</Text>
        <Text fontSize={0.8} color="white" position={[0, 0, -90]}>WELCOME TO THE NEW ERA</Text>
      </group>

      <ambientLight intensity={0.5} />
    </>
  )
}

export default function WarpBackground() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#010105]">
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }}>
        {/* FOV=90 දැම්මේ Wide-Angle පෙනුම ගන්න */}
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={90} />
        <ScrollControls pages={12} damping={0.3}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}