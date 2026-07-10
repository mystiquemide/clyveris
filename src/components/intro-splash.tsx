"use client"

import { useState, type AnimationEvent } from "react"

export function IntroSplash() {
  const [done, setDone] = useState(false)

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
