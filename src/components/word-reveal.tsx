import type { CSSProperties } from "react"

export function WordReveal({ text, step = 60 }: { text: string; step?: number }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="word" style={{ "--word-delay": `${index * step}ms` } as CSSProperties}>
          {word}{" "}
        </span>
      ))}
    </>
  )
}
