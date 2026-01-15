"use client"
import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Float, Text, Sphere, MeshDistortMaterial, AdaptiveEvents, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const blobRef = useRef<any>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!scroll) return

    // 🚀 1. Smooth Mouse Parallax (Cam Movement)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 2, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 2, 0.05)
    state.camera.lookAt(0, 0, 0)

    // 🌌 2. Scroll Depth
    if (groupRef.current) {
      groupRef.current.position.z = scroll.offset * 400
    }

    // 🔮 3. The Morphing Logic
    if (blobRef.current) {
      // පාවෙන දියර ගතිය
      blobRef.current.distort = THREE.MathUtils.lerp(0.3, 0.6, scroll.offset)
      blobRef.current.speed = 3
      
      // පාට මාරු වීම (Cyan to Pink)
      const colorA = new THREE.Color("#00d4ff")
      const colorB = new THREE.Color("#ff007f")
      blobRef.current.color.lerpColors(colorA, colorB, scroll.offset)
    }
  })

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={8000} factor={6} saturation={0} fade speed={1.5} />
      
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1.2, 64, 64]} position={[0, 0, -2]}>
          <MeshDistortMaterial
            ref={blobRef}
            color="#00d4ff"
            speed={2}
            distort={0.4}
            metalness={0.8}
            roughness={0.2} // 💡 Matte/Frosted Glass look එකක් එනවා
            emissive="#001a1f" // ඇතුළෙන් ලාවට බබළනවා
          />
        </Sphere>
      </Float>

      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      <Text fontSize={0.8} color="white" font="https://fonts.gstatic.com/s/orbitron/v31/y97pyXj9u2W6P_N0S7Y7.woff">
        NEXT WEB
      </Text>
    </group>
  )
}

export default function WarpBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="fixed inset-0 bg-black" />

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">
      {/* gl={{ powerPreference: "high-performance" }} නිසා උපරිම GPU එක පාවිච්චි කරන්න උත්සාහ කරනවා */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]} // High-res screens වලට විතරක් හොඳට පෙන්වනවා
      >
        <Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.2}>
            <SceneContent />
          </ScrollControls>
          {/* 💡 මේ දෙකෙන් වෙන්නේ මැෂින් එක ලැග් වෙනවා නම් graphics auto අඩු කරන එක */}
          <AdaptiveEvents />
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>
    </div>
  )
}