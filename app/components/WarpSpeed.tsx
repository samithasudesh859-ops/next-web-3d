"use client"
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Float, Text, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent() {
  const scroll = useScroll()
  const blobRef = useRef<any>(null!)

  useFrame((state) => {
    if (!scroll) return
    // 🚀 සරල Mouse Cam Movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.5, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.5, 0.05)
    state.camera.lookAt(0, 0, 0)

    if (blobRef.current) {
      // 🔮 දියර ගතිය (අඩු අගයන් පාවිච්චි කළා ලැග් නොවෙන්න)
      blobRef.current.distort = 0.4 + scroll.offset * 0.2
      blobRef.current.speed = 2
    }
  })

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 32, 32]} position={[0, 0, -2]}>
          {/* 💡 මම මෙතන සරලම material එක දැම්මා, කිසිම light එකක් ඕනේ නෑ පේන්න */}
          <MeshDistortMaterial
            ref={blobRef}
            color="#00d4ff"
            speed={2}
            distort={0.4}
            opacity={0.8}
            transparent
          />
        </Sphere>
      </Float>

      <ambientLight intensity={1} />

      <Text fontSize={0.6} color="white" position={[0, 0, 0]}>
        NEXT WEB
      </Text>
    </>
  )
}

export default function WarpBackground() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: false }}>
        <ScrollControls pages={5} damping={0.2}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}