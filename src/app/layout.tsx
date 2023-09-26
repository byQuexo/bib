import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BiB - Stundenplan',
  description: 'Stundenplan für bib Internationale Collage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel='manifest' href='/manifest.json' />
      
      <body className={inter.className}>{children}</body>
    </html>
  )
}
