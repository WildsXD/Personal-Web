import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WildDev',
  description: 'Created by WildDev',
  generator: 'WildDev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
