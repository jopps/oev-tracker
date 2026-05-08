import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ÖV Abfahrten Schweiz',
  description: 'Echtzeit Abfahrtszeiten für alle ÖV-Haltestellen in der Schweiz',
  themeColor: '#0a0a0a',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-[#0a0a0a] text-board-text antialiased">
        {children}
      </body>
    </html>
  )
}
