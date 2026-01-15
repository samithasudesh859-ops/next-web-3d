"use client"
import dynamic from 'next/dynamic'

const WarpBackground = dynamic(() => import('./components/WarpSpeed'), { ssr: false })

export default function Home() {
  return (
    <main className="h-screen w-full bg-black">
      <WarpBackground />
    </main>
  )
}