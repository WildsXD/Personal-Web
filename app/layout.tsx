import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WildDev',
  description: 'Dibuat oleh WildDev',
  generator: 'WildDev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
