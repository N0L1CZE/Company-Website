import './globals.css'
import { Metadata } from 'next'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Forhaus UH',
  description: 'Projektová a inženýrská činnost pro pozemní stavby',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="root">
        <Header />
        <main className="content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
