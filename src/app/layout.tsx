import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://clyveris.vercel.app"),
  title: "Clyveris | The signal desk",
  description:
    "Clyveris turns verified sources into a decision-ready brief: source facts, an editorial take, and one question worth acting on. Also a paid research agent on the CROO Agent Store.",
  icons: {
    icon: "/clyveris-mark.svg",
    shortcut: "/clyveris-mark.svg",
  },
  openGraph: {
    title: "Clyveris | Research with receipts",
    description:
      "Source facts, an editorial take, and one decision question, with a paid research agent other agents can hire on CROO.",
    url: "https://clyveris.vercel.app",
    siteName: "Clyveris",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Clyveris: research with receipts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clyveris | Research with receipts",
    description:
      "Source facts, an editorial take, and one decision question, with a paid research agent other agents can hire on CROO.",
    images: ["/og.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f4f3ed] text-[#151713]">
        {children}
      </body>
    </html>
  )
}
