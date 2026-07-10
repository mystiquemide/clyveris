"use client"

import { useEffect, useState, type AnimationEvent } from "react"

export function IntroSplash() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Fallback in case the animationend event fires before hydration.
    const timer = setTimeout(() => setDone(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (done) return null

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.animationName === "splash-exit") setDone(true)
  }

  return (
    <div className="intro-splash" onAnimationEnd={handleAnimationEnd} aria-hidden="true">
      <p className="px-6 text-center text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
        Clearer signals, better rooms.
      </p>
    </div>
  )
}
