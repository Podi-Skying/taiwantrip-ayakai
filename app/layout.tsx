import type React from "react"
import "@/app/globals.css"
import { Inter, Playfair_Display, Noto_Sans, Noto_Sans_TC, Noto_Sans_JP } from "next/font/google"
import { ClientLayout } from "./components/client-layout"

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' })
const noto = Noto_Sans({ subsets: ["latin"], weight: ['400', '500', '700'], variable: '--font-noto' })
const notoSansTC = Noto_Sans_TC({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-tc'
})
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-jp'
})

export const metadata = {
  title: "台湾旅行 | Taiwan Journey 2025",
  description: "2025年4/25日～5月3日 台湾旅行の日程計画",
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: '/logo/taiwan-logo.svg',
        type: 'image/svg+xml',
      }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontClasses = `${inter.variable} ${playfair.variable} ${noto.variable} ${notoSansTC.variable} ${notoSansJP.variable}`
  
  return (
    <html lang="ja" suppressHydrationWarning className={fontClasses}>
      <body className={notoSansJP.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}