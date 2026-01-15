"use client"
import { useState, useRef } from 'react'
// ... (කලින් තිබුණ imports ටික)

export default function WarpBackground() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#010105]">
      {/* 🎶 Audio Tag: ඔයා ගාව තියෙන Interstellar track එක public folder එකට දාන්න */}
      <audio ref={audioRef} src="/interstellar.mp3" loop />

      {/* 🔘 Music Button */}
      <button 
        onClick={toggleMusic}
        className="fixed top-5 right-5 z-50 px-4 py-2 border border-[#00d4ff] text-[#00d4ff] rounded-full hover:bg-[#00d4ff] hover:text-black transition-all"
      >
        {isPlaying ? "PAUSE MUSIC" : "PLAY MUSIC"}
      </button>

      <Canvas camera={{ fov: 90 }}>
        <ScrollControls pages={15} damping={0.4}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}