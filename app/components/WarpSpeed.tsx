"use client"
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, ScrollControls, useScroll, Text, Float, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// --- 🔥 THE REAL THICK PLASMA SHADER ---
const ThickGargantuaMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffaa00") }, // Bright Orange-Yellow
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;

    // Fast noise for plasma movement
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    void main() {
      float d = distance(vUv, vec2(0.5));
      
      // Creating a thick, organic-looking ring
      float ring = smoothstep(0.15, 0.25, d) * (1.0 - smoothstep(0.48, 0.5, d));
      
      // Moving plasma effect
      float movement = noise(vec3(vUv * 8.0, uTime * 0.4));
      float fire = ring * (0.7 + 0.5 * movement);
      
      // Color Intensity - මහතට සහ තදට පේන්න
      vec3 finalColor = uColor * fire * 4.0; 
      finalColor += vec3(1.0, 0.8, 0.4) * pow(fire, 4.0); // Bright center of the fire
      
      gl_FragColor = vec4(finalColor, fire * 1.5);
    }
  `
}

function Gargantua() {
  const mainDiskRef = useRef<THREE.Mesh>(null!)
  const lensingDiskRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (mainDiskRef.current) {
      mainDiskRef.current.rotation.z = t * 0.05
      ;(mainDiskRef.current.material as any).uniforms.uTime.value = t
    }
    if (lensingDiskRef.current) {
      lensingDiskRef.current.rotation.z = -t * 0.03
      ;(lensingDiskRef.current.material as any).uniforms.uTime.value = t
    }
  })

  return (
    <group>
      {/* 1. Black Core */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* 2. මහත ගින්දර වලල්ල (Main Disk) */}
      <mesh ref={mainDiskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[45, 45]} />
        <shaderMaterial 
          args={[ThickGargantuaMaterial]} 
          transparent 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* 3. Gravitational Lensing (The Curved Part) */}
      <mesh ref={lensingDiskRef} rotation={[0, 0, 0]}>
        <planeGeometry args={[42, 42]} />
        <shaderMaterial 
          args={[ThickGargantuaMaterial]} 
          transparent 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      <Sparkles count={4000} scale={60} size={2} speed={0.5} color="#ffcc00" />
    </group>
  )
}

function Scene() {
  const scroll = useScroll()
  useFrame((state) => {
    // සිරාවටම ඇතුළට යන Zoom එක
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 90 - scroll.offset * 160, 0.05)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <color attach="background" args={['#000']} />
      <Stars radius={400} count={50000} factor={12} fade speed={1.5} />
      <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      <Gargantua />
      
      <group position={[0, 0, -130]}>
        <Float>
          <Text fontSize={8} color="#00d4ff" font="/fonts/bold.ttf">BEYOND REALITY</Text>
        </Float>
      </group>
    </>
  )
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleEnter = () => {
    setHasEntered(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(e => console.log("Music Error:", e))
    }
  }

  return (
    <main className="w-full h-screen bg-black relative">
      <audio ref={audioRef} src="/interstellar.mp3" loop />

      {!hasEntered ? (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <h1 className="text-6xl md:text-9xl font-black text-white text-center mb-10 tracking-tighter">
            NEXT WEB<br/><span className="text-[#00d4ff]">SOLUTIONS</span>
          </h1>
          <button 
            onClick={handleEnter}
            className="px-20 py-8 border-2 border-[#ffaa00] text-[#ffaa00] font-bold tracking-[12px] hover:bg-[#ffaa00] hover:text-black transition-all duration-700 uppercase"
          >
            Enter Experience
          </button>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 20, 90], fov: 60 }}>
          <Suspense fallback={null}>
            <ScrollControls pages={25} damping={0.3}>
              <Scene />
            </ScrollControls>
          </Suspense>
        </Canvas>
      )}
    </main>
  )
}