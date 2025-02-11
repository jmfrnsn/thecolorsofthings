import type { ReactNode } from "react"
import "../app/globals.css"
import '../app/fonts.css';

export const metadata = {
  title: "Image Grid",
  description: "A responsive image grid application",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



import './globals.css'