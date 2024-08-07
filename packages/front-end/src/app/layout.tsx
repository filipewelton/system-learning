import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Home',
}

export default function RootLayout(props: Props) {
  const { children } = props
  const font = inter.className

  return (
    <html lang="en" className="bg-white">
      <body className={font}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
